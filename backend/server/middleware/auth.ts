import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface AuthRequest extends Request<any, any, any, any> {
  user?: {
    id: string
    email: string
    name: string
    role: string
  }
}

export const generateToken = (payload: { id: string; email: string; role: string }): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

export const editorOrAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'editor') {
    return res.status(403).json({ error: 'Editor or Admin access required' })
  }
  next()
}
