import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import { FavouritesProvider } from '@/lib/favourites-context'
import { AuthProvider } from '@/lib/auth-context'
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider'
import { WebVitalsReporter } from '@/components/WebVitalsReporter'
import { CartProvider } from './context/CartContext'
import CookieConsent from '@/components/CookieConsent'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const runtime = 'nodejs'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  // Removed maximumScale to allow user zooming (accessibility)
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.assadmotors.com'),
  title: {
    default: 'Assad Motors: New Cars, Used Cars, Buy a Car, Compare Prices in India 2025',
    template: '%s | Assad Motors'
  },
  description: 'assadmotors is India\'s #1 car research platform. Compare new car prices 2025, check on-road price, read expert reviews, find used cars, calculate EMI & get best deals. Trusted by 50,000+ car buyers.',
  keywords: [
    // Primary High-Intent Keywords
    'new cars India 2025',
    'car prices India',
    'on road price calculator',
    'used cars India',
    'buy new car',
    'sell your car',
    // Brand Keywords
    'Maruti Suzuki price',
    'Hyundai cars price',
    'Tata Motors cars',
    'Mahindra SUV price',
    'Kia cars India',
    'MG cars price',
    'Toyota cars India',
    'Honda cars',
    // Body Type Keywords
    'best SUV India 2025',
    'best sedan India',
    'best hatchback India',
    'compact SUV under 15 lakh',
    // Feature Keywords
    'car comparison tool',
    'EMI calculator',
    'car loan calculator',
    'fuel cost calculator',
    'car mileage comparison',
    // Location Keywords
    'car prices Mumbai',
    'car prices Delhi',
    'car prices Bangalore',
    // Long-tail Keywords
    'which car to buy under 10 lakh',
    'best car for family in India',
    'safest cars in India 2025',
    'electric cars India price',
    // Brand
    'Assad Motors',
    'Assad Motors car expert',
  ],
  authors: [{ name: 'Assad Motors Team' }],
  creator: 'Assad Motors',
  publisher: 'Assad Motors',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.assadmotors.com',
    siteName: 'Assad Motors',
    title: 'Assad Motors: New Cars, Used Cars, Buy a Car, Compare Prices in India',
    description: 'assadmotors is India\'s #1 car research platform. Compare prices, read reviews, find dealers & get best on-road price quotes.',
    images: [
      {
        url: 'https://www.assadmotors.com/logo.png',
        width: 512,
        height: 512,
        alt: 'Assad Motors Logo',
      },
      {
        url: 'https://www.assadmotors.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Assad Motors - Find Your Dream Car',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Assad Motors: New Cars, Used Cars, Compare Prices in India 2025',
    description: 'India\'s #1 car research platform. Compare new car prices, read reviews, find dealers & get best deals.',
    images: ['https://www.assadmotors.com/og-image.jpg'],
  },
  alternates: {
    // Canonical is handled dynamically per page to avoid SEO duplication issues
  },
  verification: {
    google: 'LFtjPhYM1moenJzbsp_pbaHepFH24i14Qwf6h5Z5-as',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID
  const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#dc2626" />

        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        {process.env.NEXT_PUBLIC_API_URL && (
          <link rel="preconnect" href={new URL(process.env.NEXT_PUBLIC_API_URL).origin} />
        )}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W45SDT8L');`}
        </Script>
        {/* End Google Tag Manager */}

        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `}
            </Script>
          </>
        )}

        {/* Microsoft Clarity */}
        {CLARITY_ID && (
          <Script id="clarity-script" strategy="lazyOnload">
            {`
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_ID}");
              `}
          </Script>
        )}


        {/* Schema.org structured data */}

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Assad Motors",
              "url": "https://www.assadmotors.com",
              "description": "India's leading car research platform - Compare new car prices, reviews, specifications & find best deals",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.assadmotors.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Assad Motors",
              "alternateName": "assadmotors.com",
              "url": "https://www.assadmotors.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.assadmotors.com/logo.png",
                "width": 512,
                "height": 512
              },
              "image": "https://www.assadmotors.com/logo.png",
              "description": "Assad Motors is India's comprehensive car research platform designed to help buyers make informed decisions.",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-99452-10466",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi"]
              },
              "sameAs": [
                "https://twitter.com/assadmotors",
                "https://facebook.com/assadmotors",
                "https://instagram.com/assadmotors"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50 overflow-x-hidden`} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W45SDT8L"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <AnalyticsProvider>
          <AuthProvider>
            <FavouritesProvider>
              <CartProvider>
                <WebVitalsReporter />
                <Header />
                {children}
                <Footer />
                <CookieConsent />
                <FloatingWhatsApp />
              </CartProvider>
            </FavouritesProvider>
          </AuthProvider>
        </AnalyticsProvider>
      </body>
    </html>
  )
}
