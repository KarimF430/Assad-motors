import { NextResponse } from 'next/server'
import { storage } from '../../../backend/server/storage'

const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Helper function to format view count
function formatViewCount(count: number): string {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M'
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K'
    }
    return count.toString()
}

// Helper function to format published date
function formatPublishedDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`
}

// Helper function to parse ISO 8601 duration to readable format
function parseDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return '0:00'

    const hours = (match[1] || '').replace('H', '')
    const minutes = (match[2] || '').replace('M', '')
    const seconds = (match[3] || '').replace('S', '')

    if (hours) {
        return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`
}

async function fetchYouTubeVideos(apiKey: string, channelId: string, searchQuery?: string) {
    // If channelId is a handle (starts with @), we need to get the actual channel ID first
    let actualChannelId = channelId
    if (channelId.startsWith('@')) {
        const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelId}&type=channel&key=${apiKey}`
        )
        const searchData = await searchResponse.json()

        if (searchData.error) {
            throw new Error(searchData.error.message)
        }

        if (searchData.items && searchData.items.length > 0) {
            actualChannelId = searchData.items[0].snippet.channelId
        }
    }

    // Build search URL with optional search query
    let searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${actualChannelId}&part=snippet,id&order=date&maxResults=4&type=video`

    if (searchQuery) {
        // Add search query for model-specific videos
        searchUrl += `&q=${encodeURIComponent(`"${searchQuery}"`)}`
    }

    // Fetch latest videos from the channel
    const videosResponse = await fetch(searchUrl)

    if (!videosResponse.ok) {
        const errorData = await videosResponse.json().catch(() => ({}))
        if (errorData.error?.message?.includes('quota')) {
            throw new Error('QUOTA_EXCEEDED')
        }
        throw new Error(errorData.error?.message || 'Failed to fetch YouTube videos')
    }

    const videosData = await videosResponse.json()

    if (!videosData.items || videosData.items.length === 0) {
        throw new Error('No videos found')
    }

    // Get video IDs
    const videoIds = videosData.items.map((item: any) => item.id.videoId).join(',')

    // Fetch video statistics and content details
    const statsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=statistics,contentDetails,snippet`
    )

    const statsData = await statsResponse.json()

    // Transform the data
    const videos = statsData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        duration: parseDuration(item.contentDetails.duration),
        views: formatViewCount(parseInt(item.statistics.viewCount)),
        likes: formatViewCount(parseInt(item.statistics.likeCount || '0')),
        publishedAt: formatPublishedDate(item.snippet.publishedAt),
        channelName: item.snippet.channelTitle
    }))

    // Return featured video (first one) and related videos (rest)
    return {
        featuredVideo: videos[0],
        relatedVideos: videos.slice(1)
    }
}

export async function GET(request: Request) {
    try {
        // Get search query from URL parameters
        const { searchParams } = new URL(request.url)
        const searchQuery = searchParams.get('search')

        // Construct backend URL
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        let url = `${backendUrl}/api/youtube/videos`;

        if (searchQuery) {
            url += `?search=${encodeURIComponent(searchQuery)}`;
        }

        console.log(`[YouTube API] Fetching from: ${url}`);

        // Fetch from backend
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });

        console.log(`[YouTube API] Response status: ${response.status}, Content-Type: ${response.headers.get('content-type')}`);

        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('[YouTube API] Received non-JSON response:', text.substring(0, 200));
            return NextResponse.json({
                error: 'Backend returned invalid response',
                message: 'Unexpected response format from backend'
            }, { status: 500 });
        }

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error in YouTube API route:', error)
        return NextResponse.json({
            error: 'Internal server error',
            message: 'Failed to retrieve videos'
        }, { status: 500 })
    }
}
