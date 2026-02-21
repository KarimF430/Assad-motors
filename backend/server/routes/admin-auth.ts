import express from 'express'
import bcrypt from 'bcryptjs'
import { newsStorage } from '../db/news-storage'
import { generateToken, authMiddleware, AuthRequest } from '../middleware/auth'

const router = express.Router()

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const author = await newsStorage.getAuthorByEmail(email)

    if (!author) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    if (!author.isActive) {
      return res.status(401).json({ error: 'Account is inactive' })
    }

    const isPasswordValid = await bcrypt.compare(password, author.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = generateToken({
      id: author.id,
      email: author.email,
      role: author.role
    })

    res.json({
      token,
      user: {
        id: author.id,
        name: author.name,
        email: author.email,
        role: author.role,
        profileImage: author.profileImage
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Get Profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const author = await newsStorage.getAuthorById(req.user!.id)

    if (!author) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { password, ...authorData } = author
    res.json(authorData)
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Failed to get profile' })
  }
})

// Update Profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, bio, profileImage, socialLinks } = req.body

    const updates: any = {}
    if (name) updates.name = name
    if (bio) updates.bio = bio
    if (profileImage) updates.profileImage = profileImage
    if (socialLinks) updates.socialLinks = socialLinks

    const updatedAuthor = await newsStorage.updateAuthor(req.user!.id, updates)

    if (!updatedAuthor) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { password, ...authorData } = updatedAuthor
    res.json(authorData)
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// Change Password
router.post('/change-password', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' })
    }

    const author = await newsStorage.getAuthorById(req.user!.id)

    if (!author) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, author.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await newsStorage.updateAuthor(req.user!.id, { password: hashedPassword })

    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'Failed to change password' })
  }
})

export default router
