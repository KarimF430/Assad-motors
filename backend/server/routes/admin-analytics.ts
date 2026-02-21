import express from 'express'
import { newsStorage } from '../db/news-storage'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

router.use(authMiddleware)

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    const analytics = await newsStorage.getAnalytics()
    res.json(analytics)
  } catch (error) {
    console.error('Get analytics error:', error)
    res.status(500).json({ error: 'Failed to get analytics' })
  }
})

// Get articles by month (for chart)
router.get('/articles-by-month', async (req, res) => {
  try {
    const articles = await newsStorage.getAllArticles()
    
    // Group by month
    const monthlyData: { [key: string]: number } = {}
    
    articles.forEach(article => {
      const date = new Date(article.publishDate)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
    })

    // Convert to array and sort
    const chartData = Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12) // Last 12 months

    res.json(chartData)
  } catch (error) {
    console.error('Get articles by month error:', error)
    res.status(500).json({ error: 'Failed to get articles by month' })
  }
})

// Get top articles by views
router.get('/top-articles', async (req, res) => {
  try {
    const { limit = '10' } = req.query
    const articles = await newsStorage.getAllArticles()
    
    const topArticles = articles
      .filter(a => a.status === 'published')
      .sort((a, b) => b.views - a.views)
      .slice(0, parseInt(limit as string))
      .map(a => ({
        id: a.id,
        title: a.title,
        views: a.views,
        likes: a.likes,
        comments: a.comments,
        publishDate: a.publishDate
      }))

    res.json(topArticles)
  } catch (error) {
    console.error('Get top articles error:', error)
    res.status(500).json({ error: 'Failed to get top articles' })
  }
})

// Get articles by category
router.get('/articles-by-category', async (req, res) => {
  try {
    const articles = await newsStorage.getAllArticles()
    const categories = await newsStorage.getAllCategories()
    
    const categoryData = categories.map(cat => ({
      category: cat.name,
      count: articles.filter(a => a.categoryId === cat.id).length,
      published: articles.filter(a => a.categoryId === cat.id && a.status === 'published').length
    }))

    res.json(categoryData)
  } catch (error) {
    console.error('Get articles by category error:', error)
    res.status(500).json({ error: 'Failed to get articles by category' })
  }
})

// Get author performance
router.get('/author-performance', async (req, res) => {
  try {
    const articles = await newsStorage.getAllArticles()
    const authors = await newsStorage.getAllAuthors()
    
    const authorData = authors.map(author => {
      const authorArticles = articles.filter(a => a.authorId === author.id)
      const totalViews = authorArticles.reduce((sum, a) => sum + a.views, 0)
      const totalLikes = authorArticles.reduce((sum, a) => sum + a.likes, 0)
      
      return {
        author: author.name,
        totalArticles: authorArticles.length,
        publishedArticles: authorArticles.filter(a => a.status === 'published').length,
        totalViews,
        totalLikes,
        avgViews: authorArticles.length > 0 ? Math.round(totalViews / authorArticles.length) : 0
      }
    })

    // Sort by total articles
    authorData.sort((a, b) => b.totalArticles - a.totalArticles)

    res.json(authorData)
  } catch (error) {
    console.error('Get author performance error:', error)
    res.status(500).json({ error: 'Failed to get author performance' })
  }
})

// Export data (CSV format)
router.get('/export', async (req, res) => {
  try {
    const { type = 'articles' } = req.query
    
    if (type === 'articles') {
      const articles = await newsStorage.getAllArticles()
      
      // Create CSV
      const headers = ['ID', 'Title', 'Category', 'Author', 'Status', 'Views', 'Likes', 'Comments', 'Publish Date']
      const rows = articles.map(a => [
        a.id,
        a.title,
        a.categoryId,
        a.authorId,
        a.status,
        a.views,
        a.likes,
        a.comments,
        a.publishDate
      ])
      
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
      
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename=articles.csv')
      res.send(csv)
    } else {
      res.status(400).json({ error: 'Invalid export type' })
    }
  } catch (error) {
    console.error('Export error:', error)
    res.status(500).json({ error: 'Failed to export data' })
  }
})

export default router
