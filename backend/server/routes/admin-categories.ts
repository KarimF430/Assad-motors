import express from 'express'
import { newsStorage } from '../db/news-storage'

const router = express.Router()

// Removed authentication for now - open access

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await newsStorage.getAllCategories()
    res.json(categories)
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({ error: 'Failed to get categories' })
  }
})

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await newsStorage.getCategoryById(req.params.id)
    if (!category) {
      return res.status(404).json({ error: 'Category not found' })
    }
    res.json(category)
  } catch (error) {
    console.error('Get category error:', error)
    res.status(500).json({ error: 'Failed to get category' })
  }
})

// Create category
router.post('/', async (req, res) => {
  try {
    const { name, slug, description, isFeatured = false } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    const category = await newsStorage.createCategory({
      name,
      slug: finalSlug,
      description: description || '',
      isFeatured
    })

    res.status(201).json(category)
  } catch (error) {
    console.error('Create category error:', error)
    res.status(500).json({ error: 'Failed to create category' })
  }
})

// Update category
router.put('/:id', async (req, res) => {
  try {
    const updates = { ...req.body }
    delete updates.id
    delete updates.createdAt

    const category = await newsStorage.updateCategory(req.params.id, updates)

    if (!category) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json(category)
  } catch (error) {
    console.error('Update category error:', error)
    res.status(500).json({ error: 'Failed to update category' })
  }
})

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await newsStorage.deleteCategory(req.params.id)

    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Delete category error:', error)
    res.status(500).json({ error: 'Failed to delete category' })
  }
})

export default router
