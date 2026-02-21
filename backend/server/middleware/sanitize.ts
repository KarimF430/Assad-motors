import { Request, Response, NextFunction } from 'express';

/**
 * Input Sanitization Middleware
 * Prevents XSS attacks by sanitizing user input
 */

/**
 * Simple HTML/Script tag remover
 * For production, consider using DOMPurify or similar
 */
function sanitizeString(input: string): string {
  if (typeof input !== 'string') return input;
  
  return input
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol (can be used for XSS)
    .replace(/data:text\/html/gi, '')
    // Trim whitespace
    .trim();
}

/**
 * Recursively sanitize an object
 */
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Sanitize Request Body Middleware
 */
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
}

/**
 * Validate file uploads
 */
export function validateFileUpload(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    return next();
  }

  const file = req.file;

  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return res.status(400).json({
      error: 'File too large',
      maxSize: '10MB'
    });
  }

  // Check file type for images
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (file.fieldname === 'logo' || file.fieldname === 'image') {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return res.status(400).json({
        error: 'Invalid file type',
        allowed: ['JPEG', 'PNG', 'WebP', 'SVG']
      });
    }
  }

  // Sanitize filename
  file.originalname = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');

  next();
}

/**
 * SQL Injection Prevention (for MongoDB)
 * MongoDB is generally safe from SQL injection, but we still validate
 */
export function validateMongoQuery(req: Request, res: Response, next: NextFunction) {
  // Check for MongoDB operators in user input
  const dangerousOperators = ['$where', '$regex', '$ne', '$gt', '$lt'];
  
  const checkForOperators = (obj: any): boolean => {
    if (typeof obj === 'string') {
      return dangerousOperators.some(op => obj.includes(op));
    }
    
    if (Array.isArray(obj)) {
      return obj.some(item => checkForOperators(item));
    }
    
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (dangerousOperators.includes(key) || checkForOperators(obj[key])) {
          return true;
        }
      }
    }
    
    return false;
  };

  if (req.body && checkForOperators(req.body)) {
    return res.status(400).json({
      error: 'Invalid input detected',
      code: 'INVALID_QUERY'
    });
  }

  next();
}

/**
 * Combined security middleware
 */
export function securityMiddleware(req: Request, res: Response, next: NextFunction) {
  // Apply sanitization
  sanitizeInput(req, res, () => {
    // Then validate MongoDB queries
    validateMongoQuery(req, res, next);
  });
}

/**
 * TODO: For production, consider adding:
 * 
 * 1. DOMPurify for better HTML sanitization
 *    npm install isomorphic-dompurify
 * 
 * 2. Validator.js for comprehensive validation
 *    npm install validator
 * 
 * 3. Helmet.js for HTTP security headers
 *    npm install helmet
 * 
 * 4. Express-validator for request validation
 *    npm install express-validator
 */
