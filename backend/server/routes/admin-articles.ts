import express from 'express'
import { newsStorage } from '../db/news-storage'

const router = express.Router()

// Removed authentication for now - open access

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/(^-|-$)/g, '') // Remove leading/trailing hyphens
}

// Get all articles with filters
router.get('/', async (req, res) => {
  try {
    const { category, status, search, page = '1', limit = '1000' } = req.query

    let articles = await newsStorage.getAllArticles()

    // Filter by category
    if (category && typeof category === 'string') {
      articles = articles.filter(a => a.categoryId === category)
    }

    // Filter by status
    if (status && typeof status === 'string') {
      articles = articles.filter(a => a.status === status)
    }

    // Search by title or content
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase()
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(searchLower) ||
        a.excerpt.toLowerCase().includes(searchLower)
      )
    }

    // Sort by updated date (newest first)
    articles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    // Pagination
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum
    const paginatedArticles = articles.slice(startIndex, endIndex)

    res.json({
      articles: paginatedArticles,
      total: articles.length,
      page: pageNum,
      totalPages: Math.ceil(articles.length / limitNum)
    })
  } catch (error) {
    console.error('Get articles error:', error)
    res.status(500).json({ error: 'Failed to get articles' })
  }
})

// Get single article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await newsStorage.getArticleById(req.params.id)

    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }

    res.json(article)
  } catch (error) {
    console.error('Get article error:', error)
    res.status(500).json({ error: 'Failed to get article' })
  }
})

// Create new article
router.post('/', async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      contentBlocks = [],
      categoryId,
      tags = [],
      linkedCars = [],
      featuredImage,
      seoTitle,
      seoDescription,
      seoKeywords = [],
      status = 'draft',
      publishDate,
      isFeatured = false,
      isBreaking = false
    } = req.body

    // Validation - only title is required
    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    // Generate slug if not provided or fix existing slug
    const finalSlug = slug ? generateSlug(slug) : generateSlug(title)

    // Check if slug already exists
    const existingArticle = await newsStorage.getArticleBySlug(finalSlug)
    if (existingArticle) {
      return res.status(400).json({ error: 'Slug already exists' })
    }

    const article = await newsStorage.createArticle({
      title,
      slug: finalSlug,
      excerpt,
      contentBlocks,
      categoryId,
      tags,
      authorId: 'admin', // Default author for now
      linkedCars,
      featuredImage: featuredImage || '',
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      seoKeywords,
      status,
      publishDate: publishDate || new Date().toISOString(),
      isFeatured,
      isBreaking
    })

    res.status(201).json(article)
  } catch (error) {
    console.error('Create article error:', error)
    res.status(500).json({ error: 'Failed to create article' })
  }
})

// Update article
router.put('/:id', async (req, res) => {
  try {
    const article = await newsStorage.getArticleById(req.params.id)

    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }

    // Removed auth check - open access for now

    const updates = { ...req.body }
    delete updates.id
    delete updates.createdAt
    delete updates.views
    delete updates.likes
    delete updates.comments

    // Always regenerate slug from title if title is being updated
    if (updates.title) {
      updates.slug = generateSlug(updates.title)
    } else if (updates.slug) {
      // If only slug is updated, clean it
      updates.slug = generateSlug(updates.slug)
    }

    // If slug is being updated, check for duplicates
    if (updates.slug && updates.slug !== article.slug) {
      const existingArticle = await newsStorage.getArticleBySlug(updates.slug)
      if (existingArticle) {
        return res.status(400).json({ error: 'Slug already exists' })
      }
    }

    const updatedArticle = await newsStorage.updateArticle(req.params.id, updates)

    res.json(updatedArticle)
  } catch (error) {
    console.error('Update article error:', error)
    res.status(500).json({ error: 'Failed to update article' })
  }
})

// Delete article
router.delete('/:id', async (req, res) => {
  try {
    const article = await newsStorage.getArticleById(req.params.id)

    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }

    // Removed auth check - open access for now

    await newsStorage.deleteArticle(req.params.id)

    res.json({ message: 'Article deleted successfully' })
  } catch (error) {
    console.error('Delete article error:', error)
    res.status(500).json({ error: 'Failed to delete article' })
  }
})

// Bulk update status
router.post('/bulk/update-status', async (req, res) => {
  try {
    const { articleIds, status } = req.body

    if (!articleIds || !Array.isArray(articleIds) || !status) {
      return res.status(400).json({ error: 'Article IDs and status are required' })
    }

    const results = await Promise.all(
      articleIds.map(id => newsStorage.updateArticle(id, { status }))
    )

    res.json({
      message: `Updated ${results.filter(r => r !== null).length} articles`,
      updated: results.filter(r => r !== null).length
    })
  } catch (error) {
    console.error('Bulk update error:', error)
    res.status(500).json({ error: 'Failed to bulk update articles' })
  }
})

// Bulk delete
router.post('/bulk/delete', async (req, res) => {
  try {
    const { articleIds } = req.body

    if (!articleIds || !Array.isArray(articleIds)) {
      return res.status(400).json({ error: 'Article IDs are required' })
    }

    const results = await Promise.all(
      articleIds.map(id => newsStorage.deleteArticle(id))
    )

    res.json({
      message: `Deleted ${results.filter(r => r === true).length} articles`,
      deleted: results.filter(r => r === true).length
    })
  } catch (error) {
    console.error('Bulk delete error:', error)
    res.status(500).json({ error: 'Failed to bulk delete articles' })
  }
})

export default router
