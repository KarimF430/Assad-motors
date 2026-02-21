
// Configuration for API and Backend URLs

// The Backend URL is where the Express/Node.js server lives (Render, AWS, etc.)
// In development, it defaults to localhost:5001 or 5000
export const BACKEND_URL = process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'http://localhost:5001';

// The API Base URL is usually the public facing URL of the Next.js app
// Used for internal calls, or frontend-to-nextjs-api calls
export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3000';

export const config = {
    backendUrl: BACKEND_URL,
    nextApiUrl: NEXT_PUBLIC_API_URL,
    isProduction: process.env.NODE_ENV === 'production',
};

export default config;
