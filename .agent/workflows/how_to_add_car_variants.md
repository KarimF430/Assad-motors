---
description: How to add or update car model variants with comprehensive specifications and features.
---

# Workflow: Adding Car Model Variants

This workflow documents the process for adding detailed car variants to the database using a standardized TypeScript script approach. This ensures consistency in feature mapping, technical specifications, and data formatting.

## Prerequisites

1.  **Source Data**:
    *   **Price List**: Variant names and ex-showroom prices (e.g., provided by user).
    *   **Brochure/Spec Sheet**: Technical specifications (Engine, Dimensions, Suspension) and Feature distribution (S/SX/O trims).
2.  **Access**: Write access to `backend/server/scripts/`.
3.  **Environment**: `MONGODB_URI` must be set in `.env`.

## Step-by-Step Process

### 1. Analysis & Extraction
Before writing code, analyze the provided data to extract:
*   **Engine Codes**: Identify distinct engine/transmission combos (e.g., "1.5 MPi MT", "1.5 Turbo DCT"). Map them to a simple key (e.g., `'Petrol MT'`, `'Turbo DCT'`).
*   **Trim Logic**: Understand the trim hierarchy (e.g., E < S < SX < SX(O)). Identify key differentiators (Sunroof, ADAS, Wheel size).
*   **Common Specs**: Identify specs that are constant across all variants (Dimensions, Boot Space, Ground Clearance).

### 2. Create the Update Script
Create a new file `backend/server/scripts/update[ModelName]Variants.ts`.

#### Code Structure Template

```typescript
/**
 * Update [Model Name] Variants - [Month Year]
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Variant, Model } from '../db/schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// 1. Define Engine Specifications
const ENGINES = {
    'Petrol MT': {
        engineName: '1.2l Kappa Petrol',
        displacement: '1197',
        power: '83 PS',
        torque: '113.8 Nm',
        transmission: 'Manual',
        // ... other engine fields
    },
    // ... add all engine combinations
};

// 2. Define Mileage Data (Claimed & Real World estimates)
const MILEAGE_DATA = {
    'Petrol MT': {
        mileageCompanyClaimed: '19.4',
        mileageCity: '14',
        mileageHighway: '18',
        engineSummary: 'Short description of driving feel.',
    },
};

// 3. Define Common Specifications (Constant across model)
const COMMON_SPECS = {
    length: '3995',
    width: '1770',
    airbags: '6', // If standard
    isofix: 'Yes',
    // ... dimensions, brakes, suspension
};

// 4. Implement Feature Logic
function getVariantFeatures(variantName: string) {
    // Helper booleans
    const isBase = variantName.includes('E');
    const isTop = variantName.includes('SX(O)');
    const isAuto = variantName.includes('AMT') || variantName.includes('DCT');
    
    let features: Record<string, any> = {};

    // Default features
    features.warranty = '3 Years / 100,000 Km';

    // Dynamic Features
    if (isTop) {
        features.sunroof = 'Electric Sunroof';
        features.touchScreenInfotainment = '10.25 inch';
        features.alloyWheels = 'Diamond Cut Alloy';
    } else {
        features.sunroof = 'No';
        features.touchScreenInfotainment = 'No';
        features.alloyWheels = 'Steel with Cover';
    }

    // Generate Summary
    features.headerSummary = `The ${variantName} offers...`;
    features.description = `Detailed description...`;

    return features;
}

// 5. Helper to map variant name to ENGINE key
function getEngineKey(variantName: string): string {
    if (variantName.includes('CNG')) return 'CNG MT';
    if (variantName.includes('DCT')) return 'Turbo DCT';
    return 'Petrol MT';
}

// 6. Define the Variant List (Input Data)
const VARIANTS = [
    { name: 'Magna Petrol MT', price: 600000 },
    { name: 'Sportz Petrol MT', price: 700000 },
    // ... full list
];

// 7. Main Execution Function
async function run() {
    // Setup & DB Connection...
    
    // Deletion Logic...
    
    // Insertion Loop
    for (const v of VARIANTS) {
        // Robust ID Generation
        let sanitizedName = v.name.toLowerCase()
            .replace(/\+/g, '-plus')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        const variantId = `variant-[brandId]-[modelId]-${sanitizedName}`;
        
        // Merge Data
        const engineKey = getEngineKey(v.name);
        const doc = {
            id: variantId,
            ...COMMON_SPECS,
            ...ENGINES[engineKey],
            ...MILEAGE_DATA[engineKey],
            ...getVariantFeatures(v.name),
            price: v.price
        };
        
        // Save
        await Variant.create(doc);
    }
}

run().catch(console.error);
```

### 3. Key Rules & Best Practices

1.  **ID Generation**: ALWAYS use the robust sanitization regex to avoid duplicate IDs for variants like "S" and "S+".
    ```javascript
    sanitizedName = name.toLowerCase().replace(/\+/g, '-plus').replace(/[^a-z0-9]+/g, '-');
    ```
2.  **Units**:
    *   **Power**: Use 'Bhp' or 'PS' consistently (Subject to user preference, currently widely using 'PS' or 'Bhp' mixed, but strictly following brochure is best. Current set: 'Bhp').
    *   **Torque**: 'Nm'.
    *   **Mileage**: 'kmpl' (implied in value) or 'km/kg' for CNG.
3.  **Feature Granularity**:
    *   Don't just say "Yes" for Infotainment. Say "10.25 inch HD Touchscreen".
    *   Don't just say "Yes" for Wheels. Say "16 inch Diamond Cut Alloy".
    *   Include `headerSummary` and `description` for SEO and UI.
4.  **Dry Run**: Always implement a `--execute` flag check. Default behavior should be a Dry Run (printing sample data) to prevent accidental data loss.

### 4. Running the Script

1.  **Dry Run**: `npx tsx server/scripts/update[Model]Variants.ts`
2.  **Execute**: `npx tsx server/scripts/update[Model]Variants.ts --execute`

## Example Usage

To add variants for a new model, say "Hyundai Tucson":
1.  Copy the template.
2.  Update `ENGINES` with Tucson's 2.0 Petrol & 2.0 Diesel specs.
3.  Update `VARIANTS` with the specific Platinum/Signature list.
4.  Adjust `getVariantFeatures` to handle ADAS Level 2, memory seats, etc.
5.  Run and verify.
