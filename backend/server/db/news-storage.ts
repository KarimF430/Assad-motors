import { v4 as uuidv4 } from 'uuid'
import { NewsArticle, NewsCategory, NewsTag, NewsAuthor, NewsMedia } from './schemas'

// Content Block Interface for flexible article content
export interface ContentBlock {
  id: string
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'image' | 'bulletList' | 'numberedList' | 'quote' | 'code'
  content: string
  imageUrl?: string
  imageCaption?: string
}

// News Article Interface
export interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  contentBlocks: ContentBlock[]
  categoryId: string
  tags: string[]
  authorId: string
  linkedCars: string[]
  featuredImage: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  status: 'draft' | 'published' | 'scheduled'
  publishDate: string
  views: number
  likes: number
  comments: number
  isFeatured: boolean
  isBreaking: boolean
  createdAt: string
  updatedAt: string
}

// Category Interface
export interface NewsCategory {
  id: string
  name: string
  slug: string
  description: string
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

// Tag Interface
export interface NewsTag {
  id: string
  name: string
  slug: string
  type: 'brand' | 'segment' | 'fuel' | 'general'
  createdAt: string
  updatedAt: string
}

// Author Interface
export interface NewsAuthor {
  id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'editor' | 'author'
  bio: string
  profileImage: string
  socialLinks: {
    twitter?: string
    linkedin?: string
    facebook?: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Media Interface
export interface Media {
  id: string
  filename: string
  originalName: string
  url: string
  type: 'image' | 'video'
  size: number
  uploaderId: string
  createdAt: string
}

class NewsStorage {
  async initialize() {
    try {
      // Initialize default categories if none exist
      const categoriesCount = await NewsCategory.countDocuments()
      if (categoriesCount === 0) {
        await this.createDefaultCategories()
      }
      console.log('✅ News storage initialized successfully (MongoDB)')
    } catch (error) {
      console.error('❌ Error initializing news storage:', error)
    }
  }

  private async createDefaultCategories() {
    const defaultCategories = [
      {
        id: uuidv4(),
        name: 'News',
        slug: 'news',
        description: 'Latest automotive news and updates',
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Reviews',
        slug: 'reviews',
        description: 'Expert car reviews and road tests',
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Buying Guide',
        slug: 'buying-guide',
        description: 'Car buying guides and tips',
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        name: 'Comparison',
        slug: 'comparison',
        description: 'Car comparisons and head-to-head reviews',
        isFeatured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    await NewsCategory.insertMany(defaultCategories)
    console.log('✅ Created default news categories')
  }

  // ==================== ARTICLES ====================
  async getAllArticles(): Promise<NewsArticle[]> {
    const articles = await NewsArticle.find().lean()
    return articles.map(this.mapArticle)
  }

  async getArticleById(id: string): Promise<NewsArticle | undefined> {
    const article = await NewsArticle.findOne({ id }).lean()
    return article ? this.mapArticle(article) : undefined
  }

  async getArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
    const article = await NewsArticle.findOne({ slug }).lean()
    return article ? this.mapArticle(article) : undefined
  }

  async createArticle(articleData: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'comments'>): Promise<NewsArticle> {
    const article = new NewsArticle({
      ...articleData,
      id: uuidv4(),
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    await article.save()
    return this.mapArticle(article.toObject())
  }

  async updateArticle(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle | null> {
    const article = await NewsArticle.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean()
    return article ? this.mapArticle(article) : null
  }

  async deleteArticle(id: string): Promise<boolean> {
    const result = await NewsArticle.deleteOne({ id })
    return result.deletedCount > 0
  }

  async incrementArticleViews(id: string): Promise<void> {
    await NewsArticle.updateOne({ id }, { $inc: { views: 1 } })
  }

  // ==================== CATEGORIES ====================
  async getAllCategories(): Promise<NewsCategory[]> {
    const categories = await NewsCategory.find().lean()
    return categories.map(this.mapCategory)
  }

  async getCategoryById(id: string): Promise<NewsCategory | undefined> {
    const category = await NewsCategory.findOne({ id }).lean()
    return category ? this.mapCategory(category) : undefined
  }

  async createCategory(categoryData: Omit<NewsCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsCategory> {
    const category = new NewsCategory({
      ...categoryData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    })
    await category.save()
    return this.mapCategory(category.toObject())
  }

  async updateCategory(id: string, updates: Partial<NewsCategory>): Promise<NewsCategory | null> {
    const category = await NewsCategory.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean()
    return category ? this.mapCategory(category) : null
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await NewsCategory.deleteOne({ id })
    return result.deletedCount > 0
  }

  // ==================== TAGS ====================
  async getAllTags(): Promise<NewsTag[]> {
    const tags = await NewsTag.find().lean()
    return tags.map(this.mapTag)
  }

  async getTagById(id: string): Promise<NewsTag | undefined> {
    const tag = await NewsTag.findOne({ id }).lean()
    return tag ? this.mapTag(tag) : undefined
  }

  async createTag(tagData: Omit<NewsTag, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsTag> {
    const tag = new NewsTag({
      ...tagData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    })
    await tag.save()
    return this.mapTag(tag.toObject())
  }

  async updateTag(id: string, updates: Partial<NewsTag>): Promise<NewsTag | null> {
    const tag = await NewsTag.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean()
    return tag ? this.mapTag(tag) : null
  }

  async deleteTag(id: string): Promise<boolean> {
    const result = await NewsTag.deleteOne({ id })
    return result.deletedCount > 0
  }

  // ==================== AUTHORS ====================
  async getAllAuthors(): Promise<NewsAuthor[]> {
    const authors = await NewsAuthor.find().lean()
    return authors.map(this.mapAuthor)
  }

  async getAuthorById(id: string): Promise<NewsAuthor | undefined> {
    const author = await NewsAuthor.findOne({ id }).lean()
    return author ? this.mapAuthor(author) : undefined
  }

  async getAuthorByEmail(email: string): Promise<NewsAuthor | undefined> {
    const author = await NewsAuthor.findOne({ email }).lean()
    return author ? this.mapAuthor(author) : undefined
  }

  async createAuthor(authorData: Omit<NewsAuthor, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsAuthor> {
    const author = new NewsAuthor({
      ...authorData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    })
    await author.save()
    return this.mapAuthor(author.toObject())
  }

  async updateAuthor(id: string, updates: Partial<NewsAuthor>): Promise<NewsAuthor | null> {
    const author = await NewsAuthor.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean()
    return author ? this.mapAuthor(author) : null
  }

  async deleteAuthor(id: string): Promise<boolean> {
    const result = await NewsAuthor.deleteOne({ id })
    return result.deletedCount > 0
  }

  // ==================== MEDIA ====================
  async getAllMedia(): Promise<Media[]> {
    const media = await NewsMedia.find().lean()
    return media.map(this.mapMedia)
  }

  async getMediaById(id: string): Promise<Media | undefined> {
    const media = await NewsMedia.findOne({ id }).lean()
    return media ? this.mapMedia(media) : undefined
  }

  async createMedia(mediaData: Omit<Media, 'id' | 'createdAt'>): Promise<Media> {
    const media = new NewsMedia({
      ...mediaData,
      id: uuidv4(),
      createdAt: new Date()
    })
    await media.save()
    return this.mapMedia(media.toObject())
  }

  async deleteMedia(id: string): Promise<boolean> {
    const result = await NewsMedia.deleteOne({ id })
    return result.deletedCount > 0
  }

  // ==================== ANALYTICS ====================
  async getAnalytics() {
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      scheduledArticles,
      categories,
      authors,
      topArticles
    ] = await Promise.all([
      NewsArticle.countDocuments(),
      NewsArticle.countDocuments({ status: 'published' }),
      NewsArticle.countDocuments({ status: 'draft' }),
      NewsArticle.countDocuments({ status: 'scheduled' }),
      NewsCategory.find().lean(),
      NewsAuthor.find().lean(),
      NewsArticle.find({ status: 'published' })
        .sort({ views: -1 })
        .limit(5)
        .select('id title views publishDate')
        .lean()
    ])

    const totalViews = await NewsArticle.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ])

    // Category stats
    const categoryStats = await Promise.all(
      categories.map(async (cat: any) => ({
        category: cat.name,
        count: await NewsArticle.countDocuments({ categoryId: cat.id })
      }))
    )

    // Author stats
    const authorStats = await Promise.all(
      authors.map(async (author: any) => ({
        author: author.name,
        count: await NewsArticle.countDocuments({ authorId: author.id })
      }))
    )

    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      scheduledArticles,
      totalViews: totalViews[0]?.total || 0,
      categoryStats,
      authorStats,
      topArticles: topArticles.map((a: any) => ({
        id: a.id,
        title: a.title,
        views: a.views,
        publishDate: a.publishDate
      }))
    }
  }

  // ==================== MAPPING FUNCTIONS ====================
  private mapArticle(doc: any): NewsArticle {
    return {
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt,
      contentBlocks: doc.contentBlocks || [],
      categoryId: doc.categoryId,
      tags: doc.tags || [],
      authorId: doc.authorId,
      linkedCars: doc.linkedCars || [],
      featuredImage: doc.featuredImage,
      seoTitle: doc.seoTitle,
      seoDescription: doc.seoDescription,
      seoKeywords: doc.seoKeywords || [],
      status: doc.status,
      publishDate: doc.publishDate instanceof Date ? doc.publishDate.toISOString() : doc.publishDate,
      views: doc.views || 0,
      likes: doc.likes || 0,
      comments: doc.comments || 0,
      isFeatured: doc.isFeatured || false,
      isBreaking: doc.isBreaking || false,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt
    }
  }

  private mapCategory(doc: any): NewsCategory {
    return {
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      isFeatured: doc.isFeatured || false,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt
    }
  }

  private mapTag(doc: any): NewsTag {
    return {
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      type: doc.type,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt
    }
  }

  private mapAuthor(doc: any): NewsAuthor {
    return {
      id: doc.id,
      name: doc.name,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      bio: doc.bio || '',
      profileImage: doc.profileImage || '',
      socialLinks: doc.socialLinks || {},
      isActive: doc.isActive !== undefined ? doc.isActive : true,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt
    }
  }

  private mapMedia(doc: any): Media {
    return {
      id: doc.id,
      filename: doc.filename,
      originalName: doc.originalName,
      url: doc.url,
      type: doc.type,
      size: doc.size,
      uploaderId: doc.uploaderId,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt
    }
  }
}

export const newsStorage = new NewsStorage()
