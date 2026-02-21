import express from 'express'
import { newsStorage } from '../db/news-storage'

const router = express.Router()

// Removed authentication for now - open access

// Get all tags
router.get('/', async (req, res) => {
  try {
    const { type } = req.query
    let tags = await newsStorage.getAllTags()

    if (type && typeof type === 'string') {
      tags = tags.filter(t => t.type === type)
    }

    res.json(tags)
  } catch (error) {
    console.error('Get tags error:', error)
    res.status(500).json({ error: 'Failed to get tags' })
  }
})

// Get single tag
router.get('/:id', async (req, res) => {
  try {
    const tag = await newsStorage.getTagById(req.params.id)
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' })
    }
    res.json(tag)
  } catch (error) {
    console.error('Get tag error:', error)
    res.status(500).json({ error: 'Failed to get tag' })
  }
})

// Create tag
router.post('/', async (req, res) => {
  try {
    const { name, slug, type = 'general' } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    const tag = await newsStorage.createTag({
      name,
      slug: finalSlug,
      type
    })

    res.status(201).json(tag)
  } catch (error) {
    console.error('Create tag error:', error)
    res.status(500).json({ error: 'Failed to create tag' })
  }
})

// Update tag
router.put('/:id', async (req, res) => {
  try {
    const updates = { ...req.body }
    delete updates.id
    delete updates.createdAt

    const tag = await newsStorage.updateTag(req.params.id, updates)

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' })
    }

    res.json(tag)
  } catch (error) {
    console.error('Update tag error:', error)
    res.status(500).json({ error: 'Failed to update tag' })
  }
})

// Delete tag
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await newsStorage.deleteTag(req.params.id)

    if (!deleted) {
      return res.status(404).json({ error: 'Tag not found' })
    }

    res.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Delete tag error:', error)
    res.status(500).json({ error: 'Failed to delete tag' })
  }
})

export default router
