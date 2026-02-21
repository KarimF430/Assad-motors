#!/usr/bin/env node

/**
 * Performance Analysis Script
 * Analyzes API calls and performance for Home, Brand, Model, and Variant pages
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Performance Analysis for gadizone Pages\n');
console.log('='.repeat(80));

// Page analysis results
const analysis = {
    homePage: {
        name: 'Home Page',
        path: '/app/page.tsx',
        apiCalls: [],
        serverSide: true,
        caching: [],
        estimatedLoadTime: 0
    },
    brandPage: {
        name: 'Brand Page',
        path: '/app/[brand-cars]/page.tsx',
        apiCalls: [],
        serverSide: true,
        caching: [],
        estimatedLoadTime: 0
    },
    modelPage: {
        name: 'Model Page',
        path: '/app/[brand-cars]/[model]/page.tsx',
        apiCalls: [],
        serverSide: true,
        caching: [],
        estimatedLoadTime: 0
    },
    variantPage: {
        name: 'Variant Page',
        path: '/app/[brand-cars]/[model]/variant/[variant]/page.tsx',
        apiCalls: [],
        serverSide: true,
        caching: [],
        estimatedLoadTime: 0
    }
};

// Analyze each page
function analyzePage(pageName, filePath) {
    console.log(`\n📄 Analyzing: ${pageName}`);
    console.log('-'.repeat(80));

    try {
        const fullPath = path.join(__dirname, filePath);
        const content = fs.readFileSync(fullPath, 'utf8');

        // Count API calls
        const apiCallMatches = content.match(/fetch\([^)]+\)/g) || [];
        const apiCalls = apiCallMatches.map(call => {
            const urlMatch = call.match(/['"`]([^'"`]+)['"`]/);
            return urlMatch ? urlMatch[1] : call;
        });

        // Check for caching
        const cachingMatches = content.match(/revalidate:\s*(\d+)/g) || [];
        const caching = cachingMatches.map(match => {
            const time = match.match(/\d+/)[0];
            return `${time}s`;
        });

        // Check if server-side
        const isServerSide = content.includes('export default async function') ||
            content.includes('getServerSideProps') ||
            content.includes('getStaticProps');

        console.log(`  Server-Side: ${isServerSide ? '✅ Yes' : '❌ No (Client-Side)'}`);
        console.log(`  API Calls: ${apiCalls.length}`);
        apiCalls.forEach((call, i) => {
            console.log(`    ${i + 1}. ${call}`);
        });
        console.log(`  Caching: ${caching.length > 0 ? caching.join(', ') : '❌ None'}`);

        return {
            apiCalls,
            caching,
            isServerSide,
            callCount: apiCalls.length
        };
    } catch (error) {
        console.log(`  ❌ Error reading file: ${error.message}`);
        return { apiCalls: [], caching: [], isServerSide: false, callCount: 0 };
    }
}

// Run analysis
const homeResults = analyzePage('Home Page', analysis.homePage.path);
const brandResults = analyzePage('Brand Page', analysis.brandPage.path);
const modelResults = analyzePage('Model Page', analysis.modelPage.path);
const variantResults = analyzePage('Variant Page', analysis.variantPage.path);

// Summary
console.log('\n\n📊 SUMMARY');
console.log('='.repeat(80));
console.log(`\nTotal API Calls:`);
console.log(`  Home Page:    ${homeResults.callCount} calls`);
console.log(`  Brand Page:   ${brandResults.callCount} calls`);
console.log(`  Model Page:   ${modelResults.callCount} calls`);
console.log(`  Variant Page: ${variantResults.callCount} calls`);
console.log(`  TOTAL:        ${homeResults.callCount + brandResults.callCount + modelResults.callCount + variantResults.callCount} calls across all pages`);

console.log(`\n\n💡 OPTIMIZATION RECOMMENDATIONS:`);
console.log('='.repeat(80));
console.log(`
1. **API Call Consolidation**
   - Combine multiple API calls into single endpoints where possible
   - Use GraphQL or custom aggregation endpoints

2. **Caching Strategy**
   - Implement Redis caching for frequently accessed data
   - Use Next.js ISR (Incremental Static Regeneration)
   - Set appropriate revalidation times

3. **Lazy Loading**
   - Defer loading of below-the-fold content
   - Use dynamic imports for heavy components
   - Implement intersection observer for images

4. **Code Splitting**
   - Split large bundles into smaller chunks
   - Use dynamic imports for route-specific code
   - Implement tree shaking

5. **Database Optimization**
   - Add indexes for frequently queried fields
   - Use aggregation pipelines for complex queries
   - Implement connection pooling

6. **CDN & Asset Optimization**
   - Use CDN for static assets
   - Optimize images (WebP, lazy loading)
   - Minify CSS/JS bundles
`);

console.log('\n✅ Analysis Complete!\n');
