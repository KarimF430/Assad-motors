# gadizone - Car Marketplace Website

## Overview
gadizone is a comprehensive car marketplace website built with Next.js 14, TypeScript, and Tailwind CSS. The platform allows users to explore new cars in India, compare prices, read reviews, and access various automotive tools like EMI calculators.

## Project Architecture
- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom color scheme
- **Language**: TypeScript
- **Components**: Modular React components organized by feature
- **Fonts**: Inter (Google Fonts)

## Key Features
- Car listings by brand and model
- Price comparison tools
- EMI calculator
- Car news and reviews
- YouTube video integration
- Responsive design with mobile-first approach

## Project Structure
```
app/                    # Next.js App Router pages
  brands/              # Brand-specific car listings
  cars/                # Car catalog pages
  compare/             # Car comparison tools
  emi-calculator/      # EMI calculation tool
  news/                # Car news articles
  offers/              # Special offers and deals
  price-breakup/       # Price breakdown tool

components/             # React components
  brand/               # Brand-specific components
  car-detail/          # Individual car detail components
  car-model/           # Car model page components
  cars/                # Car listing components
  common/              # Shared components
  compare/             # Comparison tool components
  emi/                 # EMI calculator components
  home/                # Homepage components
  news/                # News components
  offers/              # Offers components
  price/               # Price breakdown components

types/                 # TypeScript type definitions
utils/                 # Utility functions
```

## Development Setup
- **Server**: Next.js development server on port 5000
- **Host**: 0.0.0.0 (configured for Replit environment)
- **Build Tool**: Next.js built-in build system
- **Package Manager**: npm

## Deployment Configuration
- **Target**: Autoscale (stateless web application)
- **Build**: `npm run build`
- **Run**: `npm start`

## Recent Changes (September 19, 2025)
- Imported from GitHub and configured for Replit environment
- Fixed Next.js configuration warnings (removed deprecated `appDir`, separated viewport export)
- Added cache control headers for development
- Configured proper host binding (0.0.0.0:5000)
- Set up deployment configuration for production
- Added metadataBase for proper SEO metadata handling

## Current State
✅ Project successfully imported and configured
✅ Development server running on port 5000
✅ All Next.js warnings resolved
✅ Deployment configuration completed
✅ Ready for development and production use