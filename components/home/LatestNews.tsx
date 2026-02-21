import Link from 'next/link'
import { Calendar, User, ArrowRight, Eye } from 'lucide-react'

export default function LatestNews() {
  const newsArticles = [
    {
      title: 'Maruti Suzuki Grand Vitara Hybrid Review: The Perfect Family SUV?',
      excerpt: 'We test drive the new Grand Vitara hybrid to see if it lives up to the hype. Here\'s our detailed review covering performance, features, and value for money.',
      category: 'Review',
      author: 'Rajesh Kumar',
      publishDate: '15 Mar 2024',
      readTime: '5 min read',
      views: '12.5K',
      href: '/news/maruti-grand-vitara-review',
      image: '/news/grand-vitara-review.jpg',
    },
    {
      title: 'Top 10 Most Fuel Efficient Cars in India 2024',
      excerpt: 'With rising fuel prices, here are the most fuel-efficient cars you can buy in India right now. From hatchbacks to SUVs, we cover all segments.',
      category: 'Guide',
      author: 'Priya Singh',
      publishDate: '12 Mar 2024',
      readTime: '8 min read',
      views: '25.3K',
      href: '/news/fuel-efficient-cars-2024',
      image: '/news/fuel-efficient-cars.jpg',
    },
    {
      title: 'Electric Car Sales Surge 150% in India: What This Means for Buyers',
      excerpt: 'Electric vehicle adoption is accelerating in India. We analyze the latest sales data and what it means for potential EV buyers.',
      category: 'News',
      author: 'Amit Sharma',
      publishDate: '10 Mar 2024',
      readTime: '6 min read',
      views: '18.7K',
      href: '/news/electric-car-sales-surge',
      image: '/news/electric-cars-india.jpg',
    },
    {
      title: 'Tata Nexon EV vs Mahindra XUV400: Electric SUV Comparison',
      excerpt: 'Two of India\'s most popular electric SUVs go head-to-head. We compare specs, features, pricing, and real-world performance.',
      category: 'Comparison',
      author: 'Neha Gupta',
      publishDate: '8 Mar 2024',
      readTime: '10 min read',
      views: '31.2K',
      href: '/news/nexon-ev-vs-xuv400',
      image: '/news/ev-comparison.jpg',
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Review':
        return 'bg-blue-100 text-blue-800'
      case 'Guide':
        return 'bg-green-100 text-green-800'
      case 'News':
        return 'bg-red-100 text-red-800'
      case 'Comparison':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Latest Car News & Reviews
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest automotive news, expert reviews, and buying guides
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsArticles.map((article, index) => (
            <article
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Article Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-600">
                      {article.category.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">Article Image</span>
                </div>
              </div>

              <div className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Eye className="h-3 w-3" />
                    <span>{article.views}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{article.publishDate}</span>
                    </div>
                  </div>
                  <span>{article.readTime}</span>
                </div>

                <Link
                  href={article.href}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 group"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-8 lg:mt-12">
          <Link
            href="/news"
            className="inline-flex items-center justify-center px-6 py-3 border border-primary-600 text-base font-medium rounded-lg text-primary-600 hover:bg-primary-600 hover:text-white transition-colors duration-200"
          >
            View All News & Reviews
          </Link>
        </div>
      </div>
    </section>
  )
}
