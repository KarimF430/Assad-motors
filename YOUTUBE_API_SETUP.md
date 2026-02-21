# YouTube API Setup Guide

## Overview
The YouTube video section on the home page now fetches real videos from your YouTube channel using the YouTube Data API v3.

## Setup Instructions

### 1. Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**:
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key

### 2. Get Your Channel ID

**Option 1: From YouTube Studio**
- Go to [YouTube Studio](https://studio.youtube.com/)
- Click on "Settings" → "Channel" → "Advanced settings"
- Copy your Channel ID

**Option 2: Use Channel Handle**
- You can also use your channel handle (e.g., `@gadizone`)
- The component will automatically convert it to a channel ID

### 3. Add Environment Variables

Add these variables to your `.env.local` file:

```env
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=your_channel_id_or_@handle
```

**Example:**
```env
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=@gadizone
```

Or with actual channel ID:
```env
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxx
```

### 4. Restart Development Server

After adding the environment variables, restart your Next.js development server:

```bash
npm run dev
```

## Features

### What the Component Does:

1. **Fetches Latest Videos**: Gets the 4 most recent videos from your channel
2. **Real Data**: Displays actual video titles, thumbnails, views, likes, and duration
3. **Featured Video**: Shows the latest video in a large card
4. **More Videos**: Displays 3 more recent videos in smaller cards
5. **Fallback**: If API fails, shows placeholder data with the same design

### Data Displayed:

- ✅ Video thumbnail (high quality)
- ✅ Video title
- ✅ Channel name
- ✅ View count (formatted: 2.5M, 890K, etc.)
- ✅ Like count (formatted)
- ✅ Video duration (HH:MM:SS or MM:SS)
- ✅ Published date (relative: "2 days ago", "1 week ago", etc.)

### Design:

- ✅ **Exact same design** as before
- ✅ Gradient backgrounds for thumbnails
- ✅ Play button overlay
- ✅ Duration badge
- ✅ Hover effects
- ✅ Loading skeletons
- ✅ Responsive layout

## API Quota

YouTube Data API v3 has a daily quota limit:
- **Default quota**: 10,000 units per day
- **This component uses**: ~6 units per page load
  - 3 units for search
  - 3 units for video details
- **Estimated page loads**: ~1,600 per day

### Optimization Tips:

1. **Cache the data**: Consider caching API responses for 1-6 hours
2. **Static generation**: Use Next.js ISR (Incremental Static Regeneration)
3. **CDN caching**: Cache the page at CDN level

## Troubleshooting

### No videos showing?

1. Check if API key is correct in `.env.local`
2. Check if YouTube Data API v3 is enabled
3. Check browser console for error messages
4. Verify channel ID or handle is correct

### API quota exceeded?

1. Wait 24 hours for quota reset
2. Request quota increase from Google Cloud Console
3. Implement caching to reduce API calls

### Videos not updating?

1. Clear browser cache
2. Restart development server
3. Check if new videos are published on YouTube

## Support

For issues or questions:
- Check the [YouTube Data API documentation](https://developers.google.com/youtube/v3)
- Review error messages in browser console
- Ensure environment variables are properly set

## Example Response

The component transforms YouTube API data into this format:

```typescript
{
  id: "dQw4w9WgXcQ",
  title: "Maruti Suzuki Grand Vitara Review",
  thumbnail: "https://i.ytimg.com/vi/...",
  duration: "12:45",
  views: "2.5M",
  likes: "45K",
  publishedAt: "2 days ago",
  channelName: "gadizone"
}
```

## Production Deployment

When deploying to production:

1. Add environment variables to your hosting platform (Vercel, Netlify, etc.)
2. Consider implementing server-side caching
3. Monitor API quota usage
4. Set up error tracking (Sentry, etc.)

---

**Note**: The component will show placeholder data if the API key is not configured, so the site will still work without YouTube integration.
