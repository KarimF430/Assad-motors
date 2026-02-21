import express, { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../db/schemas';
import { v4 as uuidv4 } from 'uuid';
import passport from '../config/passport';
import crypto from 'crypto';
import { sendEmail } from '../services/email.service';
import rateLimit from 'express-rate-limit';

const router = Router();

// Login-specific rate limiter - prevents brute force attacks
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per window
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful logins
});

// OTP-specific rate limiter - prevents OTP abuse
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // 3 OTP requests per window per IP
    message: 'Too many OTP requests. Please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * User Registration with Email Verification
 * POST /api/user/register
 */
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, dateOfBirth, password } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: 'First name, last name, email, and password are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Password strength validation
        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user
        const userId = uuidv4();
        const newUser = new User({
            id: userId,
            email: email.toLowerCase(),
            password: hashedPassword,
            firstName,
            lastName,
            phone: phone || null,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            isEmailVerified: false,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newUser.save();

        // Send verification email
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

        const emailResult = await sendEmail(
            email.toLowerCase(),
            'verification',
            {
                name: firstName,
                url: verificationUrl
            }
        );

        if (!emailResult.success) {
            console.warn('⚠️ Failed to send verification email, but user created');
        }

        res.status(201).json({
            message: 'Account created! Please check your email to verify your account.',
            userId: userId,
            emailSent: emailResult.success
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

/**
 * User Login
 * POST /api/user/login
 */
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        console.log(`🔐 Login attempt for: ${email}`);

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });

        // Security: Use generic message to prevent email enumeration
        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > new Date()) {
            const remainingMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
            return res.status(423).json({
                message: `Account temporarily locked due to multiple failed login attempts. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.`,
                locked: true,
                unlockTime: user.lockUntil
            });
        }

        // If lock period has expired, reset failed attempts
        if (user.lockUntil && user.lockUntil <= new Date()) {
            user.failedLoginAttempts = 0;
            user.lockUntil = null as any;
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is disabled. Please contact support.' });
        }

        // Enforce email verification for password-based logins
        if (!user.isEmailVerified) {
            return res.status(403).json({
                message: 'Please verify your email address before logging in. Check your inbox for the verification link.',
                requiresVerification: true
            });
        }

        // Verify password - use timing-safe comparison
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            // Increment failed attempts
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

            // Lock account after 5 failed attempts
            if (user.failedLoginAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
                await user.save();
                console.log(`🔒 Account locked for user: ${user.email} (${user.failedLoginAttempts} failed attempts)`);
                return res.status(423).json({
                    message: 'Account locked due to multiple failed login attempts. Please try again in 30 minutes or reset your password.',
                    locked: true
                });
            }

            await user.save();
            const remainingAttempts = 5 - user.failedLoginAttempts;
            console.log(`⚠️ Failed login attempt for: ${user.email} (${remainingAttempts} attempts remaining)`);

            return res.status(401).json({
                message: 'Invalid email or password',
                remainingAttempts: remainingAttempts > 0 ? remainingAttempts : 0
            });
        }

        // Successful login - reset failed attempts
        user.failedLoginAttempts = 0;
        user.lockUntil = null as any;

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create session
        (req.session as any).userId = user.id;
        (req.session as any).userEmail = user.email;
        console.log(`✅ Session created for user: ${user.email} (ID: ${user.id})`);
        console.log('Session ID:', req.sessionID);

        // Set session expiry based on "Remember Me"
        if (rememberMe) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        } else {
            req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 24 hours
        }

        // Save session before responding
        req.session.save((err) => {
            if (err) {
                console.error('❌ Session save error:', err);
                return res.status(500).json({ message: 'Session creation failed. Please try again.' });
            }

            console.log('✅ Session saved successfully');

            // Return user data (without password)
            const userResponse = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                profileImage: user.profileImage,
                savedCars: user.savedCars,
                lastLogin: user.lastLogin
            };

            res.json({
                message: 'Login successful',
                user: userResponse
            });
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

/**
 * User Logout
 * POST /api/user/auth/logout
 */
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('sid'); // Clear session cookie
        res.json({ message: 'Logout successful' });
    });
});

/**
 * Get Current User
 * GET /api/user/me
 */
router.get('/me', async (req, res) => {
    try {
        // Enhanced debugging for production session issues
        console.log('🔍 /api/user/me called');
        console.log('   - Session ID:', req.sessionID);
        console.log('   - Session userId:', (req.session as any)?.userId);
        console.log('   - Session userEmail:', (req.session as any)?.userEmail);
        console.log('   - Cookie header:', req.headers.cookie ? 'present' : 'missing');
        console.log('   - Origin:', req.headers.origin);
        console.log('   - Cookies received:', req.cookies);

        const userId = (req.session as any)?.userId;

        if (!userId) {
            console.log('   ❌ No userId in session, returning 401');
            return res.status(401).json({ message: 'Not authenticated' });
        }

        console.log('   ✅ userId found:', userId);
        const user = await User.findOne({ id: userId });
        if (!user) {
            console.log('   ❌ User not found in database for id:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('   ✅ User found:', user.email);

        // Return user data (without password)
        const userResponse = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            profileImage: user.profileImage,
            savedCars: user.savedCars,
            comparisonHistory: user.comparisonHistory,
            lastLogin: user.lastLogin
        };

        res.json({ user: userResponse });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Failed to get user data' });
    }
});

/**
 * Update User Profile
 * PUT /api/user/profile
 */
router.put('/profile', async (req, res) => {
    try {
        const userId = (req.session as any)?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const { firstName, lastName, phone, dateOfBirth } = req.body;

        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone !== undefined) user.phone = phone;
        if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null as any;
        user.updatedAt = new Date();

        await user.save();

        const userResponse = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            profileImage: user.profileImage,
            updatedAt: user.updatedAt
        };

        res.json({
            message: 'Profile updated successfully',
            user: userResponse
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

/**
 * Google OAuth - Initiate
 * GET /api/user/auth/google
 */
router.get('/auth/google', (req, res, next) => {
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })(req, res, next);
});

/**
 * Google OAuth - Callback
 * GET /api/user/auth/google/callback
 */
router.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, async (err: any, user: any) => {
        console.log('🔄 Google OAuth callback received');

        if (err || !user) {
            console.error('❌ Google OAuth callback error:', err);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
        }

        // Helper to render success page
        const renderSuccessPage = (redirectUrl: string) => {
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Login Successful</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                            background: #fff;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            color: #333;
                        }
                        .container {
                            text-align: center;
                            padding: 2rem;
                            border-radius: 8px;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                            background: #fff;
                            max-width: 400px;
                            width: 90%;
                        }
                        .success-icon {
                            color: #10B981;
                            font-size: 48px;
                            margin-bottom: 1rem;
                        }
                        h1 { font-size: 24px; margin-bottom: 0.5rem; }
                        p { color: #666; margin-bottom: 2rem; }
                        .btn {
                            display: inline-block;
                            background: #EF4444; /* gadizone red */
                            color: white;
                            padding: 12px 24px;
                            border-radius: 6px;
                            text-decoration: none;
                            font-weight: 500;
                            transition: background 0.2s;
                        }
                        .btn:hover { background: #DC2626; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="success-icon">✓</div>
                        <h1>Login Successful</h1>
                        <p>You are being redirected to the app...</p>
                        <a href="${redirectUrl}" class="btn">Click here if not redirected</a>
                    </div>
                    <script>
                        setTimeout(function() {
                            window.location.href = "${redirectUrl}";
                        }, 1000);
                    </script>
                </body>
                </html>
            `;
            res.send(html);
        };

        try {
            // Update last login first
            user.lastLogin = new Date();
            await user.save();

            // CRITICAL FIX: Regenerate session FIRST, THEN set data
            // This prevents race condition where data set before regeneration is lost
            req.session.regenerate((regenerateErr) => {
                if (regenerateErr) {
                    console.error('❌ Session regenerate error:', regenerateErr);
                    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
                    return res.redirect(`${frontendUrl}/login?error=session_failed`);
                }

                // NOW set session data on the NEW regenerated session
                (req.session as any).userId = user.id;
                (req.session as any).userEmail = user.email;

                console.log('✅ Google OAuth successful for:', user.email);
                console.log('   - User ID:', user.id);
                console.log('   - Session ID after regeneration:', req.sessionID);
                console.log('   - Session data:', { userId: (req.session as any).userId, userEmail: (req.session as any).userEmail });

                // CRITICAL: Save session before redirect to ensure cookie is set
                req.session.save((saveErr) => {
                    if (saveErr) {
                        console.error('❌ Session save error:', saveErr);
                        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
                        return res.redirect(`${frontendUrl}/login?error=session_failed`);
                    }

                    console.log('✅ Session saved successfully');
                    console.log('   - Session ID:', req.sessionID);
                    console.log('   - Cookie settings:', JSON.stringify(req.session.cookie, null, 2));
                    console.log('   - Cookie domain:', req.session.cookie.domain);
                    console.log('   - Cookie secure:', req.session.cookie.secure);
                    console.log('   - Cookie sameSite:', req.session.cookie.sameSite);
                    console.log('   - Cookie httpOnly:', req.session.cookie.httpOnly);
                    console.log('   - Cookie path:', req.session.cookie.path);

                    // Log what Set-Cookie header will look like
                    const cookieHeader = res.getHeader('Set-Cookie');
                    console.log('   - Set-Cookie header will be:', cookieHeader);

                    // Verify session was saved by checking it exists
                    const sessionUserId = (req.session as any)?.userId;
                    if (!sessionUserId) {
                        console.error('⚠️  Warning: Session save completed but userId not found in session');
                    }

                    // Redirect to frontend home page with success indicator
                    // PRIORITIZE process.env.FRONTEND_URL for production correctness
                    let frontendUrl = process.env.FRONTEND_URL || 'https://www.gadizone.com';

                    // Fallback to localhost in dev only if FRONTEND_URL is explicitly missing
                    if (!process.env.FRONTEND_URL && process.env.NODE_ENV !== 'production') {
                        frontendUrl = 'http://localhost:3000';
                    }

                    frontendUrl = frontendUrl.replace(/\/$/, ''); // Remove trailing slash
                    const targetUrl = `${frontendUrl}/?login=success`;
                    console.log('🔀 Redirecting to:', targetUrl);

                    // Use robust rendering page instead of direct redirect
                    renderSuccessPage(targetUrl);
                });
            });
        } catch (error) {
            console.error('❌ Session creation error:', error);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            res.redirect(`${frontendUrl}/login?error=session_failed`);
        }
    })(req, res, next);
});

/**
 * Verify Email Address
 * GET /api/user/verify-email/:token
 */
router.get('/verify-email/:token', async (req, res) => {
    try {
        const { token } = req.params;

        // Find user with valid token
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() }
        });

        if (!user) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            return res.redirect(`${frontendUrl}/verify-email?status=error&message=invalid_token`);
        }

        // Mark email as verified
        user.isEmailVerified = true;
        user.emailVerificationToken = null as any;
        user.emailVerificationExpires = null as any;
        user.updatedAt = new Date();
        await user.save();

        console.log('✅ Email verified for:', user.email);

        // Send welcome email
        await sendEmail(
            user.email,
            'welcome',
            { name: user.firstName }
        );

        // Auto-login user by creating session
        (req.session as any).userId = user.id;
        (req.session as any).userEmail = user.email;

        // Save session before redirect
        req.session.save((err) => {
            if (err) {
                console.error('❌ Session save error after verification:', err);
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
                return res.redirect(`${frontendUrl}/?verified=true&login=failed`);
            }

            console.log('✅ Session saved after email verification');
            // Redirect to frontend with success
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            res.redirect(`${frontendUrl}/?verified=true`);
        });

    } catch (error) {
        console.error('Email verification error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/verify-email?status=error&message=server_error`);
    }
});

/**
 * Resend Verification Email
 * POST /api/user/resend-verification
 */
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Don't reveal if email exists (security best practice)
            return res.json({ message: 'If the email exists and is unverified, a new verification link has been sent.' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.emailVerificationToken = verificationToken;
        user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        user.updatedAt = new Date();
        await user.save();

        // Send verification email
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

        await sendEmail(
            user.email,
            'verification',
            {
                name: user.firstName,
                url: verificationUrl
            }
        );

        res.json({ message: 'Verification email sent successfully!' });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ message: 'Failed to resend verification email' });
    }
});

/**
 * Forgot Password - Request Reset Link
 * POST /api/user/forgot-password
 */
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        // If user doesn't exist, show message directing to sign up
        if (!user) {
            return res.status(404).json({
                message: 'This email is not registered. Please sign up to create an account.',
                isNewEmail: true
            });
        }

        // Don't allow password reset for OAuth-only users
        if (!user.password) {
            return res.status(400).json({
                message: 'This account uses Google sign-in. Please use "Continue with Google" to log in.'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        user.updatedAt = new Date();
        await user.save();

        // Send password reset email
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

        await sendEmail(
            user.email,
            'passwordReset',
            {
                name: user.firstName,
                url: resetUrl
            }
        );

        console.log('✅ Password reset email sent to:', user.email);

        const standardResponse = 'If an account exists with that email, a password reset link has been sent.';
        res.json({ message: standardResponse });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Failed to process password reset request' });
    }
});

/**
 * Reset Password - Set New Password
 * POST /api/user/reset-password
 */
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        // Password strength validation
        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        // Find user with valid reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Password reset link is invalid or has expired. Please request a new one.'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = null as any;
        user.resetPasswordExpires = null as any;
        user.updatedAt = new Date();
        await user.save();

        console.log('✅ Password reset successful for:', user.email);

        res.json({
            message: 'Password reset successful! You can now log in with your new password.'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
});

/**
 * Send OTP for Login
 * POST /api/user/send-otp
 */
router.post('/send-otp', otpLimiter, async (req, res) => {
    try {
        const { email } = req.body;
        console.log(`📧 OTP request for: ${email}`);

        // Validation
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // For security, don't reveal if email exists
            // But for user experience, we'll tell them to sign up
            return res.status(404).json({
                message: 'No account found with this email. Please sign up first.',
                isNewEmail: true
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is disabled. Please contact support.' });
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > new Date()) {
            const remainingMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
            return res.status(423).json({
                message: `Account temporarily locked. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.`,
                locked: true
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP before storing (security)
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Store OTP with 5-minute expiry
        user.otp = hashedOtp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        user.otpAttempts = 0; // Reset attempts on new OTP
        user.updatedAt = new Date();
        await user.save();

        // Send OTP email
        const emailResult = await sendEmail(
            user.email,
            'otpLogin',
            {
                name: user.firstName || '',
                otp: otp
            }
        );

        if (!emailResult.success) {
            console.error('❌ Failed to send OTP email:', emailResult.error);
            return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
        }

        console.log(`✅ OTP sent to: ${user.email}`);

        // Mask email for response
        const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

        res.json({
            message: 'OTP sent successfully!',
            maskedEmail: maskedEmail
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
});

/**
 * Verify OTP and Login
 * POST /api/user/verify-otp
 */
router.post('/verify-otp', loginLimiter, async (req, res) => {
    try {
        const { email, otp, rememberMe } = req.body;
        console.log(`🔐 OTP verification attempt for: ${email}`);

        // Validation
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // OTP format validation (6 digits)
        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({ message: 'Invalid OTP format. Please enter 6 digits.' });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or OTP' });
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > new Date()) {
            const remainingMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
            return res.status(423).json({
                message: `Account temporarily locked. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.`,
                locked: true
            });
        }

        // Reset lock if expired
        if (user.lockUntil && user.lockUntil <= new Date()) {
            user.otpAttempts = 0;
            user.lockUntil = null as any;
        }

        // Check if OTP exists and not expired
        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({
                message: 'No OTP found. Please request a new one.',
                expired: true
            });
        }

        if (user.otpExpires < new Date()) {
            // Clear expired OTP
            user.otp = null as any;
            user.otpExpires = null as any;
            await user.save();
            return res.status(400).json({
                message: 'OTP has expired. Please request a new one.',
                expired: true
            });
        }

        // Verify OTP with timing-safe comparison
        const isOtpValid = await bcrypt.compare(otp, user.otp);

        if (!isOtpValid) {
            // Increment failed attempts
            user.otpAttempts = (user.otpAttempts || 0) + 1;

            // Lock account after 5 failed attempts
            if (user.otpAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
                user.otp = null as any;
                user.otpExpires = null as any;
                await user.save();
                console.log(`🔒 Account locked for user: ${user.email} (${user.otpAttempts} failed OTP attempts)`);
                return res.status(423).json({
                    message: 'Too many failed attempts. Account locked for 15 minutes.',
                    locked: true
                });
            }

            await user.save();
            const remainingAttempts = 5 - user.otpAttempts;
            console.log(`⚠️ Failed OTP attempt for: ${user.email} (${remainingAttempts} attempts remaining)`);

            return res.status(401).json({
                message: 'Invalid OTP. Please try again.',
                remainingAttempts: remainingAttempts > 0 ? remainingAttempts : 0
            });
        }

        // OTP is valid - Clear OTP and reset attempts
        user.otp = null as any;
        user.otpExpires = null as any;
        user.otpAttempts = 0;
        user.lockUntil = null as any;
        user.lastLogin = new Date();
        user.isEmailVerified = true; // OTP login verifies email
        user.updatedAt = new Date();
        await user.save();

        console.log(`✅ OTP verified for: ${user.email}`);

        // Create session
        (req.session as any).userId = user.id;
        (req.session as any).userEmail = user.email;

        // Set session expiry based on "Remember Me"
        if (rememberMe) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        } else {
            req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 24 hours
        }

        // Send welcome email (non-blocking)
        sendEmail(
            user.email,
            'welcomeLogin',
            { name: user.firstName || 'there' }
        ).catch(err => console.warn('⚠️ Welcome email failed:', err));

        // Save session before responding
        req.session.save((err) => {
            if (err) {
                console.error('❌ Session save error:', err);
                return res.status(500).json({ message: 'Login failed. Please try again.' });
            }

            console.log('✅ Session saved after OTP verification');

            // Return user data (without password/otp)
            const userResponse = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                profileImage: user.profileImage,
                savedCars: user.savedCars,
                lastLogin: user.lastLogin
            };

            res.json({
                message: 'Login successful!',
                user: userResponse
            });
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

/**
 * Send OTP for Registration (Step 1)
 * POST /api/user/register-send-otp
 */
router.post('/register-send-otp', otpLimiter, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, dateOfBirth } = req.body;
        console.log(`📧 Registration OTP request for: ${email}`);

        // Validation
        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                message: 'First name, last name, and email are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                message: 'This email is already registered. Please login instead.',
                alreadyExists: true
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Store pending registration data in a temporary collection or session
        // For simplicity, we'll create the user with isEmailVerified=false and store OTP
        const userId = uuidv4();
        const pendingUser = new User({
            id: userId,
            email: email.toLowerCase(),
            password: null, // No password for OTP-based registration
            firstName,
            lastName,
            phone: phone || null,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            isEmailVerified: false,
            isActive: false, // Not active until OTP verified
            otp: hashedOtp,
            otpExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
            otpAttempts: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await pendingUser.save();

        // Send OTP email
        const emailResult = await sendEmail(
            email.toLowerCase(),
            'otpLogin',
            {
                name: firstName,
                otp: otp
            }
        );

        if (!emailResult.success) {
            // Rollback - delete the pending user
            await User.deleteOne({ id: userId });
            console.error('❌ Failed to send registration OTP email:', emailResult.error);
            return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
        }

        console.log(`✅ Registration OTP sent to: ${email}`);

        // Mask email for response
        const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

        res.json({
            message: 'OTP sent successfully!',
            maskedEmail: maskedEmail,
            userId: userId
        });

    } catch (error: any) {
        console.error('Register send OTP error:', error);
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'This email is already registered. Please login instead.',
                alreadyExists: true
            });
        }
        res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
});

/**
 * Verify OTP and Complete Registration (Step 2)
 * POST /api/user/register-verify-otp
 */
router.post('/register-verify-otp', loginLimiter, async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(`🔐 Registration OTP verification for: ${email}`);

        // Validation
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // OTP format validation (6 digits)
        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({ message: 'Invalid OTP format. Please enter 6 digits.' });
        }

        // Find pending user
        const user = await User.findOne({ email: email.toLowerCase(), isActive: false });

        if (!user) {
            return res.status(400).json({
                message: 'No pending registration found. Please start again.',
                notFound: true
            });
        }

        // Check if OTP exists and not expired
        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({
                message: 'No OTP found. Please request a new one.',
                expired: true
            });
        }

        if (user.otpExpires < new Date()) {
            // Delete expired pending registration
            await User.deleteOne({ id: user.id });
            return res.status(400).json({
                message: 'OTP has expired. Please register again.',
                expired: true
            });
        }

        // Verify OTP
        const isOtpValid = await bcrypt.compare(otp, user.otp);

        if (!isOtpValid) {
            user.otpAttempts = (user.otpAttempts || 0) + 1;

            if (user.otpAttempts >= 5) {
                // Delete after too many failed attempts
                await User.deleteOne({ id: user.id });
                return res.status(423).json({
                    message: 'Too many failed attempts. Please register again.',
                    locked: true
                });
            }

            await user.save();
            const remainingAttempts = 5 - user.otpAttempts;

            return res.status(401).json({
                message: 'Invalid OTP. Please try again.',
                remainingAttempts
            });
        }

        // OTP is valid - Activate the account
        user.otp = null as any;
        user.otpExpires = null as any;
        user.otpAttempts = 0;
        user.isEmailVerified = true;
        user.isActive = true;
        user.lastLogin = new Date();
        user.updatedAt = new Date();
        await user.save();

        console.log(`✅ Registration completed for: ${user.email}`);

        // Create session
        (req.session as any).userId = user.id;
        (req.session as any).userEmail = user.email;

        // Send welcome email (non-blocking)
        sendEmail(
            user.email,
            'welcome',
            { name: user.firstName || 'there' }
        ).catch(err => console.warn('⚠️ Welcome email failed:', err));

        // Save session
        req.session.save((err) => {
            if (err) {
                console.error('❌ Session save error:', err);
                return res.status(500).json({ message: 'Account created but login failed. Please login manually.' });
            }

            console.log('✅ Session saved after registration');

            const userResponse = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                profileImage: user.profileImage,
                savedCars: user.savedCars,
                lastLogin: user.lastLogin
            };

            res.status(201).json({
                message: 'Account created successfully! Welcome to gadizone.',
                user: userResponse
            });
        });

    } catch (error) {
        console.error('Register verify OTP error:', error);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

export default router;
