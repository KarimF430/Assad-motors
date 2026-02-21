import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import type { AdminUser } from '@shared/schema';
import dotenv from 'dotenv';

// Ensure environment variables are loaded even if index.ts hasn't yet
dotenv.config();

// JWT Configuration
const AUTH_BYPASS = process.env.AUTH_BYPASS === 'true';

// SECURITY: Prevent AUTH_BYPASS in production
if (AUTH_BYPASS && process.env.NODE_ENV === 'production') {
  throw new Error('🚨 SECURITY ERROR: AUTH_BYPASS cannot be enabled in production!');
}

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET && !AUTH_BYPASS) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_EXPIRES_IN = '24h'; // Token expires in 24 hours
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // Refresh token expires in 7 days

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compare password with hashed password
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(user: {
  id: string;
  email: string;
  name: string;
  role: string;
}): string {
  if (!JWT_SECRET && AUTH_BYPASS) return 'dev-access-token';
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(userId: string): string {
  if (!JWT_SECRET && AUTH_BYPASS) return 'dev-refresh-token';
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): any {
  try {
    if (AUTH_BYPASS) {
      // Return a permissive dev user payload
      return {
        id: 'dev-admin',
        email: 'dev@local',
        name: 'Developer',
        role: 'super_admin',
      };
    }
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Authentication middleware
 * Protects routes by verifying JWT token
 */
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Dev bypass: always authenticate as super_admin
  if (AUTH_BYPASS) {
    req.user = {
      id: 'dev-admin',
      email: 'dev@local',
      name: 'Developer',
      role: 'super_admin',
    };
    return next();
  }
  // Get token from Authorization header or cookie
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1] || req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      error: 'Access denied. No token provided.',
      code: 'NO_TOKEN',
    });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({
      error: 'Invalid or expired token.',
      code: 'INVALID_TOKEN',
    });
  }

  // Attach user info to request
  req.user = {
    id: decoded.id,
    email: decoded.email,
    name: decoded.name,
    role: decoded.role,
  };

  next();
}

/**
 * Role-based authorization middleware
 */
export function authorizeRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (AUTH_BYPASS) return next();
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required.',
        code: 'NOT_AUTHENTICATED',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions.',
        code: 'FORBIDDEN',
      });
    }

    next();
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * - At least 8 characters
 * - Contains uppercase and lowercase
 * - Contains numbers
 * - Contains special characters
 */
export function isStrongPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain numbers');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain special characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize user data (remove sensitive fields)
 */
export function sanitizeUser(user: AdminUser): Omit<AdminUser, 'password'> {
  const { password, ...sanitized } = user;
  return sanitized;
}
