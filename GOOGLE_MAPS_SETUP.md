# Google Maps API Integration Setup

This document explains how to set up Google Maps API for location services in the gadizone website.

## Features

The Google Maps integration provides:

1. **GPS Location Detection** - Automatically detect user's current location
2. **City Autocomplete Search** - Real-time city search with Google Places API
3. **Reverse Geocoding** - Convert GPS coordinates to city/state names
4. **Fallback Support** - Works with local city database if API is unavailable

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**

4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### 2. Configure API Key Restrictions (Recommended)

For security, restrict your API key:

1. **Application restrictions:**
   - Select "HTTP referrers (websites)"
   - Add your domain(s):
     - `localhost:3000/*` (for development)
     - `yourdomain.com/*` (for production)

2. **API restrictions:**
   - Select "Restrict key"
   - Enable only:
     - Maps JavaScript API
     - Places API
     - Geocoding API

### 3. Add API Key to Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your API key to `.env.local`:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## Usage

### Location Page

The location page (`/location`) automatically uses Google Maps API when available:

- **Search Cities**: Type in the search box to get real-time suggestions from Google Places
- **Detect Location**: Click "Detect my location" to use GPS and reverse geocoding
- **Fallback**: If API is unavailable, falls back to local Indian cities database

### API Functions

The `lib/google-maps.ts` file provides these functions:

```typescript
// Load Google Maps API
await loadGoogleMapsAPI()

// Get current GPS location
const coords = await getCurrentLocation()

// Reverse geocode coordinates to city
const location = await reverseGeocode(lat, lng)

// Search cities with autocomplete
const predictions = await searchCitiesWithGoogle(query)

// Get place details from place_id
const details = await getPlaceDetails(placeId)

// Detect location and get city (combines GPS + geocoding)
const result = await detectLocationAndGetCity()
```

## API Pricing

Google Maps APIs have a free tier:

- **Maps JavaScript API**: $7 per 1000 loads (28,500 free per month)
- **Places API (Autocomplete)**: $2.83 per 1000 requests (first $200 free)
- **Geocoding API**: $5 per 1000 requests (first $200 free)

For most websites, the free tier is sufficient. Monitor usage in Google Cloud Console.

## Fallback Behavior

If Google Maps API is not configured or fails:

1. **Search**: Uses local Indian cities database (`lib/cities-data.ts`)
2. **Location Detection**: Shows error message, user must select manually
3. **No Breaking**: Application continues to work with reduced functionality

## Testing

### Test with API Key

1. Add API key to `.env.local`
2. Go to `/location`
3. Try:
   - Searching for cities (should show "Google Maps" badge)
   - Clicking "Detect my location" (should request GPS permission)

### Test without API Key

1. Remove or comment out API key in `.env.local`
2. Go to `/location`
3. Verify:
   - Search still works with local database
   - "Detect my location" shows "Requires Google Maps API"
   - Popular cities list still works

## Troubleshooting

### "Google Maps API key is not configured"

- Check that `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in `.env.local`
- Restart development server after adding the key

### "Failed to load Google Maps API"

- Check API key is valid
- Verify APIs are enabled in Google Cloud Console
- Check browser console for specific error messages
- Verify domain restrictions allow your current domain

### "Location permission denied"

- User must grant location permission in browser
- Check browser settings allow location access
- HTTPS is required for geolocation in production

### "Geocoding failed" or "Places search failed"

- Check API quotas in Google Cloud Console
- Verify billing is enabled (required after free tier)
- Check API restrictions allow your domain

## Security Best Practices

1. **Never commit API keys** - Use `.env.local` (already in `.gitignore`)
2. **Restrict API key** - Add domain and API restrictions
3. **Monitor usage** - Set up billing alerts in Google Cloud
4. **Rotate keys** - If key is exposed, regenerate immediately

## Support

For issues with:
- **Google Maps API**: [Google Maps Platform Support](https://developers.google.com/maps/support)
- **This Integration**: Check browser console for error messages

## Additional Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)
