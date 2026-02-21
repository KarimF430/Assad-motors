import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../db/schemas';
import { v4 as uuidv4 } from 'uuid';

const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

// Configure Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: `${backendUrl}/api/user/auth/google/callback`,
            scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Extract user info from Google profile
                const email = profile.emails?.[0]?.value;
                const firstName = profile.name?.givenName || '';
                const lastName = profile.name?.familyName || '';
                const profileImage = profile.photos?.[0]?.value;
                const googleId = profile.id;

                if (!email) {
                    return done(new Error('No email found in Google profile'), undefined);
                }

                // Check if user already exists
                let user = await User.findOne({ email: email.toLowerCase() });

                if (user) {
                    // User exists - update Google ID if not set
                    if (!user.googleId) {
                        user.googleId = googleId;
                        user.profileImage = profileImage || user.profileImage;
                        await user.save();
                    }

                    // Update last login
                    user.lastLogin = new Date();
                    await user.save();
                } else {
                    // Create new user account
                    const userId = uuidv4();
                    user = new User({
                        id: userId,
                        email: email.toLowerCase(),
                        password: null, // OAuth users don't have password
                        firstName,
                        lastName,
                        googleId,
                        profileImage,
                        isEmailVerified: true, // Google emails are already verified
                        isActive: true,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });

                    await user.save();
                    console.log('✅ New user created via Google OAuth:', email);
                }

                return done(null, user);
            } catch (error) {
                console.error('Google OAuth error:', error);
                return done(error as Error, undefined);
            }
        }
    )
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findOne({ id });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
