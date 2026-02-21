import cron from 'node-cron';
import type { IStorage } from './storage';

// Helper function to format view count
function formatViewCount(count: number): string {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
}

// Helper function to format published date
function formatPublishedDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
}

// Helper function to parse ISO 8601 duration to readable format
function parseDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    if (hours) {
        return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
}

async function fetchYouTubeVideos(apiKey: string, channelId: string) {
    // If channelId is a handle (starts with @), we need to get the actual channel ID first
    let actualChannelId = channelId;
    if (channelId.startsWith('@')) {
        const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelId}&type=channel&key=${apiKey}`
        );
        const searchData = await searchResponse.json();

        if (searchData.error) {
            throw new Error(searchData.error.message);
        }

        if (searchData.items && searchData.items.length > 0) {
            actualChannelId = searchData.items[0].snippet.channelId;
        }
    }

    // Build search URL
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${actualChannelId}&part=snippet,id&order=date&maxResults=4&type=video`;

    // Fetch latest videos from the channel
    const videosResponse = await fetch(searchUrl);

    if (!videosResponse.ok) {
        const errorData = await videosResponse.json().catch(() => ({}));
        if (errorData.error?.message?.includes('quota')) {
            throw new Error('QUOTA_EXCEEDED');
        }
        throw new Error(errorData.error?.message || 'Failed to fetch YouTube videos');
    }

    const videosData = await videosResponse.json();

    if (!videosData.items || videosData.items.length === 0) {
        throw new Error('No videos found');
    }

    // Get video IDs
    const videoIds = videosData.items.map((item: any) => item.id.videoId).join(',');

    // Fetch video statistics and content details
    const statsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=statistics,contentDetails,snippet`
    );

    const statsData = await statsResponse.json();

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
    }));

    // Return featured video (first one) and related videos (rest)
    return {
        featuredVideo: videos[0],
        relatedVideos: videos.slice(1)
    };
}

// Main fetch function - fetches and saves to persistent storage
export async function fetchAndCacheYouTubeVideos(storage: IStorage): Promise<void> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID || '@gadizone';

    if (!apiKey) {
        console.error('❌ YouTube API key not configured - skipping scheduled fetch');
        return;
    }

    try {
        console.log('🔄 Starting scheduled YouTube fetch...');
        const freshData = await fetchYouTubeVideos(apiKey, channelId);

        // Save to persistent storage
        await storage.saveYouTubeCache(freshData, Date.now());

        console.log('✅ Scheduled YouTube fetch completed successfully');
    } catch (error) {
        console.error('❌ Scheduled YouTube fetch failed:', error);
    }
}

// Start the scheduled job
export function startYouTubeScheduler(storage: IStorage): void {
    const fetchHour = parseInt(process.env.YOUTUBE_FETCH_TIME || '11', 10);

    // Cron pattern: "0 11 * * *" = Every day at 11:00 AM
    // For testing: "*/1 * * * *" = Every minute
    const cronPattern = `0 ${fetchHour} * * *`;

    cron.schedule(cronPattern, async () => {
        console.log(`⏰ Scheduled YouTube fetch triggered at ${new Date().toLocaleString()}`);
        await fetchAndCacheYouTubeVideos(storage);
    });

    console.log(`✅ YouTube scheduler started - will fetch daily at ${fetchHour}:00`);
}
