import express from 'express'
import bcrypt from 'bcryptjs'
import { newsStorage } from '../db/news-storage'
import { authMiddleware, adminOnly } from '../middleware/auth'

const router = express.Router()

router.use(authMiddleware)

// Get all authors
router.get('/', async (req, res) => {
  try {
    const { role, isActive } = req.query
    let authors = await newsStorage.getAllAuthors()

    if (role && typeof role === 'string') {
      authors = authors.filter(a => a.role === role)
    }

    if (isActive !== undefined) {
      const activeFilter = isActive === 'true'
      authors = authors.filter(a => a.isActive === activeFilter)
    }

    // Remove passwords from response
    const authorsWithoutPassword = authors.map(({ password, ...author }) => author)

    res.json(authorsWithoutPassword)
  } catch (error) {
    console.error('Get authors error:', error)
    res.status(500).json({ error: 'Failed to get authors' })
  }
})

// Get single author
router.get('/:id', async (req, res) => {
  try {
    const author = await newsStorage.getAuthorById(req.params.id)
    if (!author) {
      return res.status(404).json({ error: 'Author not found' })
    }

    const { password, ...authorData } = author
    res.json(authorData)
  } catch (error) {
    console.error('Get author error:', error)
    res.status(500).json({ error: 'Failed to get author' })
  }
})

// Create author (admin only)
router.post('/', adminOnly, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'author',
      bio = '',
      profileImage = '',
      socialLinks = {},
      isActive = true
    } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    // Check if email already exists
    const existingAuthor = await newsStorage.getAuthorByEmail(email)
    if (existingAuthor) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const author = await newsStorage.createAuthor({
      name,
      email,
      password: hashedPassword,
      role,
      bio,
      profileImage,
      socialLinks,
      isActive
    })

    const { password: _, ...authorData } = author
    res.status(201).json(authorData)
  } catch (error) {
    console.error('Create author error:', error)
    res.status(500).json({ error: 'Failed to create author' })
  }
})

// Update author (admin only)
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const updates = { ...req.body }
    delete updates.id
    delete updates.createdAt
    delete updates.password // Password should be updated via separate endpoint

    const author = await newsStorage.updateAuthor(req.params.id, updates)

    if (!author) {
      return res.status(404).json({ error: 'Author not found' })
    }

    const { password, ...authorData } = author
    res.json(authorData)
  } catch (error) {
    console.error('Update author error:', error)
    res.status(500).json({ error: 'Failed to update author' })
  }
})

// Reset author password (admin only)
router.post('/:id/reset-password', adminOnly, async (req, res) => {
  try {
    const { newPassword } = req.body

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const author = await newsStorage.updateAuthor(req.params.id, { password: hashedPassword })

    if (!author) {
      return res.status(404).json({ error: 'Author not found' })
    }

    res.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ error: 'Failed to reset password' })
  }
})

// Delete author (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const deleted = await newsStorage.deleteAuthor(req.params.id)

    if (!deleted) {
      return res.status(404).json({ error: 'Author not found' })
    }

    res.json({ message: 'Author deleted successfully' })
  } catch (error) {
    console.error('Delete author error:', error)
    res.status(500).json({ error: 'Failed to delete author' })
  }
})

export default router
