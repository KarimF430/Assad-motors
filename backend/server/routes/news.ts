import express from 'express'
import { newsStorage } from '../db/news-storage'
import { redisCacheMiddleware, CacheTTL as RedisCacheTTL } from '../middleware/redis-cache'

const router = express.Router()

// Get all published articles (public)
router.get('/', redisCacheMiddleware(RedisCacheTTL.NEWS), async (req, res) => {
  try {
    // Set browser cache headers (10 minutes)
    res.set('Cache-Control', 'public, max-age=600, s-maxage=600, stale-while-revalidate=1800');

    const { category, tag, search, page = '1', limit = '10' } = req.query

    let articles = await newsStorage.getAllArticles()

    // Only show published articles
    articles = articles.filter(a => a.status === 'published')

    // Filter by category
    if (category && typeof category === 'string') {
      articles = articles.filter(a => a.categoryId === category)
    }

    // Debug info
    const debugInfo: any = {
      tagParam: tag,
      articlesCount: articles.length
    }

    // Filter by tag
    if (tag && typeof tag === 'string') {
      console.log(`🔍 Filtering by tag: ${tag}`)
      // Check if tag is a name or ID
      const allTags = await newsStorage.getAllTags()
      const tagObj = allTags.find(t => t.name.toLowerCase() === tag.toLowerCase() || t.id === tag)

      debugInfo.allTagsCount = allTags.length

      if (tagObj) {
        console.log(`✅ Found tag object: ${tagObj.name} (${tagObj.id})`)
        debugInfo.foundTag = { name: tagObj.name, id: tagObj.id }

        // Filter by tag ID (UUID)
        const initialCount = articles.length
        articles = articles.filter(a => a.tags.includes(tagObj.id))
        console.log(`📊 Filtered from ${initialCount} to ${articles.length} articles`)
        debugInfo.filteredCount = articles.length
      } else {
        console.log(`❌ Tag object not found for: ${tag}`)
        debugInfo.tagFound = false
        // Fallback: check if tag string is directly in tags array (for legacy/custom tags)
        articles = articles.filter(a => a.tags.includes(tag))
      }
    }

    // Search
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase()
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(searchLower) ||
        a.excerpt.toLowerCase().includes(searchLower)
      )
    }

    // Sort by publish date (newest first)
    articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())

    // Pagination
    const pageNum = parseInt(page as string) || 1
    const limitNum = parseInt(limit as string) || 10
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum
    const paginatedArticles = articles.slice(startIndex, endIndex)

    res.json({
      articles: paginatedArticles,
      total: articles.length,
      page: pageNum,
      totalPages: Math.ceil(articles.length / limitNum),
      debug: debugInfo // Return debug info
    })
  } catch (error) {
    console.error('Get articles error:', error)
    res.status(500).json({ error: 'Failed to get articles' })
  }
})

// Get featured articles (public) - MUST come before /:slug
router.get('/featured/list', async (req, res) => {
  try {
    const articles = await newsStorage.getAllArticles()

    const featuredArticles = articles
      .filter(a => a.status === 'published' && a.isFeatured)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, 5)

    res.json(featuredArticles)
  } catch (error) {
    console.error('Get featured articles error:', error)
    res.status(500).json({ error: 'Failed to get featured articles' })
  }
})

// Get trending articles (public)
router.get('/trending/list', async (req, res) => {
  try {
    const articles = await newsStorage.getAllArticles()

    const trendingArticles = articles
      .filter(a => a.status === 'published')
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    res.json(trendingArticles)
  } catch (error) {
    console.error('Get trending articles error:', error)
    res.status(500).json({ error: 'Failed to get trending articles' })
  }
})

// Get categories (public)
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await newsStorage.getAllCategories()
    res.json(categories)
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({ error: 'Failed to get categories' })
  }
})

// Get tags (public)
router.get('/tags/list', async (req, res) => {
  try {
    const tags = await newsStorage.getAllTags()
    res.json(tags)
  } catch (error) {
    console.error('Get tags error:', error)
    res.status(500).json({ error: 'Failed to get tags' })
  }
})

// Get single article by slug (public) - MUST come LAST to avoid catching other routes
router.get('/:slug', async (req, res) => {
  try {
    const article = await newsStorage.getArticleBySlug(req.params.slug)

    if (!article || article.status !== 'published') {
      return res.status(404).json({ error: 'Article not found' })
    }

    // Increment views
    await newsStorage.incrementArticleViews(article.id)

    res.json(article)
  } catch (error) {
    console.error('Get article error:', error)
    res.status(500).json({ error: 'Failed to get article' })
  }
})

export default router
