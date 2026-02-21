import { NewsListing } from '@/components/news/NewsListing'

// Quick test to verify the component renders
console.log('NewsListing component:', NewsListing)
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001')

// Test fetch
fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/news?limit=5`)
    .then(res => res.json())
    .then(data => console.log('News API Response:', data))
    .catch(err => console.error('News API Error:', err))
