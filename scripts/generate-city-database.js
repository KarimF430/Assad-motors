/**
 * Google Maps City Database Generator
 * Fetches comprehensive list of Indian cities (Tier 1, 2, 3) using Google Maps API
 * Generates updated city-database.ts with accurate state and RTO mapping
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'null';

// RTO State Mapping (from existing rto-data.ts)
const RTO_STATE_MAPPING = {
    'Maharashtra': 'MAHARASHTRA',
    'Delhi': 'THE GOV OF NCT OF DELHI (UT)',
    'Karnataka': 'KARNATAKA',
    'Tamil Nadu': 'TAMIL NADU',
    'Gujarat': 'GUJARAT',
    'Uttar Pradesh': 'UTTAR PRADESH',
    'West Bengal': 'WEST BENGAL',
    'Rajasthan': 'RAJASTHAN',
    'Madhya Pradesh': 'MADHYA PRADESH',
    'Telangana': 'TELANGANA',
    'Andhra Pradesh': 'ANDHRA PRADESH',
    'Kerala': 'KERALA',
    'Punjab': 'PUNJAB',
    'Haryana': 'HARYANA',
    'Bihar': 'BIHAR',
    'Odisha': 'ODISHA',
    'Assam': 'ASSAM',
    'Jharkhand': 'JHARKHAND',
    'Chhattisgarh': 'CHHATTISGARH',
    'Uttarakhand': 'UTTARAKHAND',
    'Himachal Pradesh': 'HIMACHAL PRADESH',
    'Goa': 'GOA',
    'Jammu and Kashmir': 'JAMMU & KASHMIR (UT)',
    'Chandigarh': 'CHANDIGARH (UT)',
    'Puducherry': 'PUDUCHERRY (UT)',
};

// Comprehensive list of Indian cities by tier
const INDIAN_CITIES = {
    tier1: [
        'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai',
        'Kolkata', 'Pune', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur',
        'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
        'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
        'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi'
    ],
    tier2: [
        'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
        'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada',
        'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Chandigarh', 'Guwahati',
        'Solapur', 'Hubli-Dharwad', 'Mysore', 'Tiruchirappalli', 'Bareilly', 'Aligarh',
        'Tiruppur', 'Moradabad', 'Jalandhar', 'Bhubaneswar', 'Salem', 'Warangal',
        'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati',
        'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi',
        'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela',
        'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar',
        'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu',
        'Sangli-Miraj', 'Mangalore', 'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli',
        'Malegaon', 'Gaya', 'Jalgaon', 'Udaipur', 'Maheshtala'
    ],
    tier3: [
        'Davanagere', 'Kozhikode', 'Kurnool', 'Rajpur Sonarpur', 'Rajahmundry', 'Bokaro',
        'South Dumdum', 'Bellary', 'Patiala', 'Gopalpur', 'Agartala', 'Bhagalpur',
        'Muzaffarnagar', 'Bhatpara', 'Panihati', 'Latur', 'Dhule', 'Tirupati',
        'Rohtak', 'Korba', 'Bhilwara', 'Berhampur', 'Muzaffarpur', 'Ahmednagar',
        'Mathura', 'Kollam', 'Avadi', 'Kadapa', 'Kamarhati', 'Sambalpur',
        'Bilaspur', 'Shahjahanpur', 'Satara', 'Bijapur', 'Rampur', 'Shivamogga',
        'Chandrapur', 'Junagadh', 'Thrissur', 'Alwar', 'Bardhaman', 'Kulti',
        'Kakinada', 'Nizamabad', 'Parbhani', 'Tumkur', 'Khammam', 'Ozhukarai',
        'Bihar Sharif', 'Panipat', 'Darbhanga', 'Bally', 'Aizawl', 'Dewas',
        'Ichalkaranji', 'Karnal', 'Bathinda', 'Jalna', 'Eluru', 'Kirari Suleman Nagar',
        'Barasat', 'Purnia', 'Satna', 'Mau', 'Sonipat', 'Farrukhabad', 'Sagar',
        'Rourkela', 'Durg', 'Imphal', 'Ratlam', 'Hapur', 'Arrah', 'Karimnagar',
        'Anantapur', 'Etawah', 'Ambernath', 'North Dumdum', 'Bharatpur', 'Begusarai',
        'New Delhi', 'Gandhidham', 'Baranagar', 'Tiruvottiyur', 'Puducherry', 'Sikar',
        'Thoothukudi', 'Raurkela Industrial Township', 'Thiruvananthapuram', 'Nagaon',
        'Ongole', 'Deoghar', 'Chapra', 'Haldia', 'Khandwa', 'Nandyal', 'Morena',
        'Amroha', 'Anand', 'Bhind', 'Bhalswa Jahangir Pur', 'Madhyamgram', 'Bhiwani'
    ]
};

// Helper function to make HTTPS requests
function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Fetch city details from Google Maps Geocoding API
async function fetchCityDetails(cityName) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName + ', India')}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
        const data = await httpsGet(url);

        if (data.status === 'OK' && data.results && data.results[0]) {
            const result = data.results[0];
            const components = result.address_components;

            let city = '';
            let state = '';

            // Extract city and state from address components
            for (const component of components) {
                if (component.types.includes('locality')) {
                    city = component.long_name;
                }
                if (component.types.includes('administrative_area_level_1')) {
                    state = component.long_name;
                }
            }

            // Fallback to administrative_area_level_2 for city
            if (!city) {
                for (const component of components) {
                    if (component.types.includes('administrative_area_level_2')) {
                        city = component.long_name;
                        break;
                    }
                }
            }

            if (city && state) {
                const rtoState = RTO_STATE_MAPPING[state] || state.toUpperCase();
                return { city, state, rtoState };
            }
        }

        return null;
    } catch (error) {
        console.error(`Error fetching ${cityName}:`, error.message);
        return null;
    }
}

// Add delay to avoid rate limiting
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to generate city database
async function generateCityDatabase() {
    console.log('🚀 Starting city database generation...\n');

    const allCities = new Map(); // Use Map to avoid duplicates
    let processed = 0;
    let total = 0;

    // Count total cities
    Object.values(INDIAN_CITIES).forEach(cities => total += cities.length);

    // Process each tier
    for (const [tier, cities] of Object.entries(INDIAN_CITIES)) {
        console.log(`\n📍 Processing ${tier.toUpperCase()} cities (${cities.length} cities)...`);

        const isPopular = tier === 'tier1';

        for (const cityName of cities) {
            processed++;
            process.stdout.write(`\r   Progress: ${processed}/${total} (${Math.round(processed / total * 100)}%)`);

            const details = await fetchCityDetails(cityName);

            if (details) {
                const key = `${details.city}-${details.state}`;
                if (!allCities.has(key)) {
                    allCities.set(key, {
                        city: details.city,
                        state: details.state,
                        rtoState: details.rtoState,
                        popular: isPopular
                    });
                }
            }

            // Add delay to avoid rate limiting (50 requests per second limit)
            await delay(100); // 10 requests per second
        }
    }

    console.log('\n\n✅ Fetching complete!\n');
    console.log(`📊 Total unique cities: ${allCities.size}`);

    // Generate TypeScript code
    const cityArray = Array.from(allCities.values());

    // Sort: popular first, then alphabetically
    cityArray.sort((a, b) => {
        if (a.popular !== b.popular) return b.popular ? 1 : -1;
        return a.city.localeCompare(b.city);
    });

    // Generate TypeScript file content
    const tsContent = `/**
 * Comprehensive City-to-State Mapping for India
 * Auto-generated using Google Maps API
 * Generated on: ${new Date().toISOString()}
 * Total cities: ${cityArray.length}
 * Tier 1 (Popular): ${cityArray.filter(c => c.popular).length}
 * Tier 2 & 3: ${cityArray.filter(c => !c.popular).length}
 */

export interface CityData {
    city: string;
    state: string;
    rtoState: string;
    popular: boolean;
}

export const CITY_DATABASE: CityData[] = [
${cityArray.map(city => `    { city: '${city.city}', state: '${city.state}', rtoState: '${city.rtoState}', popular: ${city.popular} }`).join(',\n')}
];

// Create fast lookup maps
const cityToStateMap = new Map<string, CityData>();
const stateToRTOMap = new Map<string, string>();

// Initialize maps for O(1) lookup
CITY_DATABASE.forEach(cityData => {
    cityToStateMap.set(cityData.city.toLowerCase(), cityData);
    stateToRTOMap.set(cityData.state.toUpperCase(), cityData.rtoState);
});

/**
 * Get RTO state name from city (O(1) lookup)
 */
export function getRTOStateFromCity(city: string): string {
    const cityData = cityToStateMap.get(city.toLowerCase());
    if (cityData) {
        return cityData.rtoState;
    }

    // Fallback: try to match state name directly
    const upperCity = city.toUpperCase();
    const rtoState = stateToRTOMap.get(upperCity);
    if (rtoState) {
        return rtoState;
    }

    console.warn(\`City "\${city}" not found in database, using Maharashtra default\`);
    return 'MAHARASHTRA';
}

/**
 * Get state name from city
 */
export function getStateFromCity(city: string): string {
    const cityData = cityToStateMap.get(city.toLowerCase());
    return cityData?.state || 'Maharashtra';
}

/**
 * Get popular cities for dropdown
 */
export function getPopularCities(): CityData[] {
    return CITY_DATABASE.filter(c => c.popular);
}

/**
 * Get all cities sorted alphabetically
 */
export function getAllCities(): CityData[] {
    return [...CITY_DATABASE].sort((a, b) => a.city.localeCompare(b.city));
}

/**
 * Search cities by name (fuzzy search)
 */
export function searchCities(query: string): CityData[] {
    const lowerQuery = query.toLowerCase();
    return CITY_DATABASE.filter(c =>
        c.city.toLowerCase().includes(lowerQuery) ||
        c.state.toLowerCase().includes(lowerQuery)
    ).slice(0, 10);
}

/**
 * Normalize Google Maps state name to RTO state format
 */
export function normalizeStateToRTO(stateName: string): string {
    const upperState = stateName.toUpperCase();
    const rtoState = stateToRTOMap.get(upperState);
    if (rtoState) {
        return rtoState;
    }

    const stateMapping: Record<string, string> = {
        'DELHI': 'THE GOV OF NCT OF DELHI (UT)',
        'NCT OF DELHI': 'THE GOV OF NCT OF DELHI (UT)',
        'NATIONAL CAPITAL TERRITORY OF DELHI': 'THE GOV OF NCT OF DELHI (UT)',
        'CHANDIGARH': 'CHANDIGARH (UT)',
        'PUDUCHERRY': 'PUDUCHERRY (UT)',
        'PONDICHERRY': 'PUDUCHERRY (UT)',
        'JAMMU AND KASHMIR': 'JAMMU & KASHMIR (UT)',
        'JAMMU & KASHMIR': 'JAMMU & KASHMIR (UT)',
    };

    const mapped = stateMapping[upperState];
    if (mapped) {
        return mapped;
    }

    console.warn(\`State "\${stateName}" not in RTO database, using as-is\`);
    return upperState;
}

/**
 * Get RTO state from Google Maps-style city/state string
 */
export function getRTOStateFromGoogleMaps(cityState: string): string {
    const parts = cityState.split(',').map(p => p.trim());
    const city = parts[0];
    const state = parts[1];

    if (city) {
        const cityData = cityToStateMap.get(city.toLowerCase());
        if (cityData) {
            return cityData.rtoState;
        }
    }

    if (state) {
        return normalizeStateToRTO(state);
    }

    console.warn(\`Could not determine RTO state for "\${cityState}", using Maharashtra\`);
    return 'MAHARASHTRA';
}
`;

    // Write to file
    const outputPath = path.join(__dirname, '..', 'lib', 'city-database.ts');
    fs.writeFileSync(outputPath, tsContent, 'utf8');

    console.log(`\n✅ City database generated successfully!`);
    console.log(`📁 File: ${outputPath}`);
    console.log(`\n📈 Statistics:`);
    console.log(`   - Total cities: ${cityArray.length}`);
    console.log(`   - Popular (Tier 1): ${cityArray.filter(c => c.popular).length}`);
    console.log(`   - Other (Tier 2 & 3): ${cityArray.filter(c => !c.popular).length}`);
    console.log(`\n🎉 Done!`);
}

// Run the generator
generateCityDatabase().catch(console.error);
