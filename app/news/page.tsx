import { Metadata } from 'next'
import Footer from '@/components/Footer'
import NewsListing from '@/components/news/NewsListing'
import Breadcrumb from '@/components/common/Breadcrumb'

export const metadata: Metadata = {
  title: 'Car News, Reviews & Expert Insights | gadizone',
  description: 'Stay updated with the latest car news, expert reviews, buying guides, and automotive insights. Get comprehensive coverage of new car launches, industry trends, and expert opinions.',
  keywords: 'car news, car reviews, automotive news, car buying guide, new car launches, car industry news, expert car reviews, automobile news',
  openGraph: {
    title: 'Car News, Reviews & Expert Insights',
    description: 'Stay updated with the latest car news, expert reviews, buying guides, and automotive insights.',
    type: 'website',
    url: '/news',
  },
  alternates: {
    canonical: '/news',
  },
}

export default function NewsPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <main>
          {/* News Listing */}
          <NewsListing />
        </main>
      </div>
      <Breadcrumb items={[{ label: 'News' }]} />
      <Footer />
    </>
  )
}
