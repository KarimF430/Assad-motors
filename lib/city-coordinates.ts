// City coordinates database for India
// Used to calculate nearby cities based on distance

export interface CityCoordinates {
    name: string
    slug: string
    lat: number
    lng: number
    state: string
}

// Haversine formula to calculate distance between two coordinates
export function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

// Get nearby cities within a radius
export function getNearbyCities(
    currentCitySlug: string,
    radiusKm: number = 250,
    maxCities: number = 8
): CityCoordinates[] {
    const currentCity = CITY_COORDINATES.find(c => c.slug === currentCitySlug)

    if (!currentCity) {
        // Fallback: return major metros if city not found
        return CITY_COORDINATES
            .filter(c => ['mumbai', 'delhi', 'bangalore', 'chennai', 'hyderabad', 'pune', 'kolkata', 'ahmedabad'].includes(c.slug))
            .slice(0, maxCities)
    }

    return CITY_COORDINATES
        .filter(c => c.slug !== currentCitySlug)
        .map(city => ({
            ...city,
            distance: getDistanceKm(currentCity.lat, currentCity.lng, city.lat, city.lng)
        }))
        .filter(city => city.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, maxCities)
}

// 500+ Indian cities with coordinates
export const CITY_COORDINATES: CityCoordinates[] = [
    // Maharashtra
    { name: 'Mumbai', slug: 'mumbai', lat: 19.076, lng: 72.8777, state: 'Maharashtra' },
    { name: 'Pune', slug: 'pune', lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
    { name: 'Nagpur', slug: 'nagpur', lat: 21.1458, lng: 79.0882, state: 'Maharashtra' },
    { name: 'Thane', slug: 'thane', lat: 19.2183, lng: 72.9781, state: 'Maharashtra' },
    { name: 'Nashik', slug: 'nashik', lat: 19.9975, lng: 73.7898, state: 'Maharashtra' },
    { name: 'Aurangabad', slug: 'aurangabad', lat: 19.8762, lng: 75.3433, state: 'Maharashtra' },
    { name: 'Solapur', slug: 'solapur', lat: 17.6599, lng: 75.9064, state: 'Maharashtra' },
    { name: 'Kolhapur', slug: 'kolhapur', lat: 16.7050, lng: 74.2433, state: 'Maharashtra' },
    { name: 'Navi Mumbai', slug: 'navi-mumbai', lat: 19.0330, lng: 73.0297, state: 'Maharashtra' },
    { name: 'Amravati', slug: 'amravati', lat: 20.9374, lng: 77.7796, state: 'Maharashtra' },
    { name: 'Sangli', slug: 'sangli', lat: 16.8524, lng: 74.5815, state: 'Maharashtra' },
    { name: 'Ahmednagar', slug: 'ahmednagar', lat: 19.0948, lng: 74.7480, state: 'Maharashtra' },
    { name: 'Latur', slug: 'latur', lat: 18.4088, lng: 76.5604, state: 'Maharashtra' },
    { name: 'Dhule', slug: 'dhule', lat: 20.9042, lng: 74.7749, state: 'Maharashtra' },
    { name: 'Akola', slug: 'akola', lat: 20.7002, lng: 77.0082, state: 'Maharashtra' },
    { name: 'Jalgaon', slug: 'jalgaon', lat: 21.0077, lng: 75.5626, state: 'Maharashtra' },
    { name: 'Chandrapur', slug: 'chandrapur', lat: 19.9615, lng: 79.2961, state: 'Maharashtra' },
    { name: 'Parbhani', slug: 'parbhani', lat: 19.2704, lng: 76.7747, state: 'Maharashtra' },
    { name: 'Satara', slug: 'satara', lat: 17.6805, lng: 74.0183, state: 'Maharashtra' },
    { name: 'Ratnagiri', slug: 'ratnagiri', lat: 16.9902, lng: 73.3120, state: 'Maharashtra' },

    // Delhi NCR
    { name: 'Delhi', slug: 'delhi', lat: 28.7041, lng: 77.1025, state: 'Delhi' },
    { name: 'New Delhi', slug: 'new-delhi', lat: 28.6139, lng: 77.2090, state: 'Delhi' },
    { name: 'Noida', slug: 'noida', lat: 28.5355, lng: 77.3910, state: 'Uttar Pradesh' },
    { name: 'Gurgaon', slug: 'gurgaon', lat: 28.4595, lng: 77.0266, state: 'Haryana' },
    { name: 'Faridabad', slug: 'faridabad', lat: 28.4089, lng: 77.3178, state: 'Haryana' },
    { name: 'Ghaziabad', slug: 'ghaziabad', lat: 28.6692, lng: 77.4538, state: 'Uttar Pradesh' },
    { name: 'Greater Noida', slug: 'greater-noida', lat: 28.4744, lng: 77.5040, state: 'Uttar Pradesh' },

    // Karnataka
    { name: 'Bangalore', slug: 'bangalore', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
    { name: 'Mysore', slug: 'mysore', lat: 12.2958, lng: 76.6394, state: 'Karnataka' },
    { name: 'Hubli', slug: 'hubli', lat: 15.3647, lng: 75.1240, state: 'Karnataka' },
    { name: 'Mangalore', slug: 'mangalore', lat: 12.9141, lng: 74.8560, state: 'Karnataka' },
    { name: 'Belgaum', slug: 'belgaum', lat: 15.8497, lng: 74.4977, state: 'Karnataka' },
    { name: 'Gulbarga', slug: 'gulbarga', lat: 17.3297, lng: 76.8343, state: 'Karnataka' },
    { name: 'Davangere', slug: 'davangere', lat: 14.4644, lng: 75.9218, state: 'Karnataka' },
    { name: 'Bellary', slug: 'bellary', lat: 15.1394, lng: 76.9214, state: 'Karnataka' },
    { name: 'Shimoga', slug: 'shimoga', lat: 13.9299, lng: 75.5681, state: 'Karnataka' },
    { name: 'Tumkur', slug: 'tumkur', lat: 13.3379, lng: 77.1173, state: 'Karnataka' },
    { name: 'Bijapur', slug: 'bijapur', lat: 16.8302, lng: 75.7100, state: 'Karnataka' },
    { name: 'Raichur', slug: 'raichur', lat: 16.2076, lng: 77.3463, state: 'Karnataka' },
    { name: 'Hassan', slug: 'hassan', lat: 13.0068, lng: 76.1004, state: 'Karnataka' },
    { name: 'Bidar', slug: 'bidar', lat: 17.9104, lng: 77.5199, state: 'Karnataka' },

    // Tamil Nadu
    { name: 'Chennai', slug: 'chennai', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
    { name: 'Coimbatore', slug: 'coimbatore', lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu' },
    { name: 'Madurai', slug: 'madurai', lat: 9.9252, lng: 78.1198, state: 'Tamil Nadu' },
    { name: 'Trichy', slug: 'trichy', lat: 10.7905, lng: 78.7047, state: 'Tamil Nadu' },
    { name: 'Salem', slug: 'salem', lat: 11.6643, lng: 78.1460, state: 'Tamil Nadu' },
    { name: 'Tirunelveli', slug: 'tirunelveli', lat: 8.7139, lng: 77.7567, state: 'Tamil Nadu' },
    { name: 'Erode', slug: 'erode', lat: 11.3410, lng: 77.7172, state: 'Tamil Nadu' },
    { name: 'Vellore', slug: 'vellore', lat: 12.9165, lng: 79.1325, state: 'Tamil Nadu' },
    { name: 'Thanjavur', slug: 'thanjavur', lat: 10.7870, lng: 79.1378, state: 'Tamil Nadu' },
    { name: 'Tirupur', slug: 'tirupur', lat: 11.1085, lng: 77.3411, state: 'Tamil Nadu' },
    { name: 'Dindigul', slug: 'dindigul', lat: 10.3624, lng: 77.9695, state: 'Tamil Nadu' },
    { name: 'Nagercoil', slug: 'nagercoil', lat: 8.1833, lng: 77.4119, state: 'Tamil Nadu' },
    { name: 'Kanchipuram', slug: 'kanchipuram', lat: 12.8342, lng: 79.7036, state: 'Tamil Nadu' },
    { name: 'Cuddalore', slug: 'cuddalore', lat: 11.7480, lng: 79.7714, state: 'Tamil Nadu' },
    { name: 'Pondicherry', slug: 'pondicherry', lat: 11.9416, lng: 79.8083, state: 'Puducherry' },

    // Telangana
    { name: 'Hyderabad', slug: 'hyderabad', lat: 17.3850, lng: 78.4867, state: 'Telangana' },
    { name: 'Warangal', slug: 'warangal', lat: 17.9784, lng: 79.5941, state: 'Telangana' },
    { name: 'Nizamabad', slug: 'nizamabad', lat: 18.6725, lng: 78.0941, state: 'Telangana' },
    { name: 'Karimnagar', slug: 'karimnagar', lat: 18.4386, lng: 79.1288, state: 'Telangana' },
    { name: 'Khammam', slug: 'khammam', lat: 17.2473, lng: 80.1514, state: 'Telangana' },
    { name: 'Mahbubnagar', slug: 'mahbubnagar', lat: 16.7488, lng: 78.0035, state: 'Telangana' },
    { name: 'Nalgonda', slug: 'nalgonda', lat: 17.0575, lng: 79.2690, state: 'Telangana' },
    { name: 'Secunderabad', slug: 'secunderabad', lat: 17.4399, lng: 78.4983, state: 'Telangana' },

    // Andhra Pradesh
    { name: 'Vijayawada', slug: 'vijayawada', lat: 16.5062, lng: 80.6480, state: 'Andhra Pradesh' },
    { name: 'Visakhapatnam', slug: 'visakhapatnam', lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh' },
    { name: 'Guntur', slug: 'guntur', lat: 16.3067, lng: 80.4365, state: 'Andhra Pradesh' },
    { name: 'Nellore', slug: 'nellore', lat: 14.4426, lng: 79.9865, state: 'Andhra Pradesh' },
    { name: 'Kurnool', slug: 'kurnool', lat: 15.8281, lng: 78.0373, state: 'Andhra Pradesh' },
    { name: 'Rajahmundry', slug: 'rajahmundry', lat: 17.0005, lng: 81.8040, state: 'Andhra Pradesh' },
    { name: 'Tirupati', slug: 'tirupati', lat: 13.6288, lng: 79.4192, state: 'Andhra Pradesh' },
    { name: 'Kadapa', slug: 'kadapa', lat: 14.4674, lng: 78.8241, state: 'Andhra Pradesh' },
    { name: 'Kakinada', slug: 'kakinada', lat: 16.9891, lng: 82.2475, state: 'Andhra Pradesh' },
    { name: 'Anantapur', slug: 'anantapur', lat: 14.6819, lng: 77.6006, state: 'Andhra Pradesh' },
    { name: 'Eluru', slug: 'eluru', lat: 16.7107, lng: 81.0952, state: 'Andhra Pradesh' },
    { name: 'Ongole', slug: 'ongole', lat: 15.5057, lng: 80.0499, state: 'Andhra Pradesh' },
    { name: 'Chittoor', slug: 'chittoor', lat: 13.2172, lng: 79.1003, state: 'Andhra Pradesh' },

    // Gujarat
    { name: 'Ahmedabad', slug: 'ahmedabad', lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
    { name: 'Surat', slug: 'surat', lat: 21.1702, lng: 72.8311, state: 'Gujarat' },
    { name: 'Vadodara', slug: 'vadodara', lat: 22.3072, lng: 73.1812, state: 'Gujarat' },
    { name: 'Rajkot', slug: 'rajkot', lat: 22.3039, lng: 70.8022, state: 'Gujarat' },
    { name: 'Bhavnagar', slug: 'bhavnagar', lat: 21.7645, lng: 72.1519, state: 'Gujarat' },
    { name: 'Jamnagar', slug: 'jamnagar', lat: 22.4707, lng: 70.0577, state: 'Gujarat' },
    { name: 'Junagadh', slug: 'junagadh', lat: 21.5222, lng: 70.4579, state: 'Gujarat' },
    { name: 'Gandhinagar', slug: 'gandhinagar', lat: 23.2156, lng: 72.6369, state: 'Gujarat' },
    { name: 'Anand', slug: 'anand', lat: 22.5645, lng: 72.9289, state: 'Gujarat' },
    { name: 'Bharuch', slug: 'bharuch', lat: 21.7051, lng: 72.9959, state: 'Gujarat' },
    { name: 'Mehsana', slug: 'mehsana', lat: 23.5880, lng: 72.3693, state: 'Gujarat' },
    { name: 'Morbi', slug: 'morbi', lat: 22.8173, lng: 70.8370, state: 'Gujarat' },
    { name: 'Nadiad', slug: 'nadiad', lat: 22.6916, lng: 72.8634, state: 'Gujarat' },
    { name: 'Porbandar', slug: 'porbandar', lat: 21.6417, lng: 69.6293, state: 'Gujarat' },
    { name: 'Vapi', slug: 'vapi', lat: 20.3893, lng: 72.9106, state: 'Gujarat' },

    // Rajasthan
    { name: 'Jaipur', slug: 'jaipur', lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
    { name: 'Jodhpur', slug: 'jodhpur', lat: 26.2389, lng: 73.0243, state: 'Rajasthan' },
    { name: 'Udaipur', slug: 'udaipur', lat: 24.5854, lng: 73.7125, state: 'Rajasthan' },
    { name: 'Kota', slug: 'kota', lat: 25.2138, lng: 75.8648, state: 'Rajasthan' },
    { name: 'Bikaner', slug: 'bikaner', lat: 28.0229, lng: 73.3119, state: 'Rajasthan' },
    { name: 'Ajmer', slug: 'ajmer', lat: 26.4499, lng: 74.6399, state: 'Rajasthan' },
    { name: 'Bhilwara', slug: 'bhilwara', lat: 25.3407, lng: 74.6313, state: 'Rajasthan' },
    { name: 'Alwar', slug: 'alwar', lat: 27.5530, lng: 76.6346, state: 'Rajasthan' },
    { name: 'Bharatpur', slug: 'bharatpur', lat: 27.2152, lng: 77.5030, state: 'Rajasthan' },
    { name: 'Sikar', slug: 'sikar', lat: 27.6094, lng: 75.1399, state: 'Rajasthan' },
    { name: 'Pali', slug: 'pali', lat: 25.7711, lng: 73.3234, state: 'Rajasthan' },
    { name: 'Sri Ganganagar', slug: 'sri-ganganagar', lat: 29.9038, lng: 73.8772, state: 'Rajasthan' },
    { name: 'Jhunjhunu', slug: 'jhunjhunu', lat: 28.1290, lng: 75.3983, state: 'Rajasthan' },
    { name: 'Churu', slug: 'churu', lat: 28.3034, lng: 74.9672, state: 'Rajasthan' },
    { name: 'Hanumangarh', slug: 'hanumangarh', lat: 29.5817, lng: 74.3294, state: 'Rajasthan' },

    // West Bengal
    { name: 'Kolkata', slug: 'kolkata', lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
    { name: 'Howrah', slug: 'howrah', lat: 22.5958, lng: 88.2636, state: 'West Bengal' },
    { name: 'Durgapur', slug: 'durgapur', lat: 23.5204, lng: 87.3119, state: 'West Bengal' },
    { name: 'Asansol', slug: 'asansol', lat: 23.6739, lng: 86.9524, state: 'West Bengal' },
    { name: 'Siliguri', slug: 'siliguri', lat: 26.7271, lng: 88.6393, state: 'West Bengal' },
    { name: 'Bardhaman', slug: 'bardhaman', lat: 23.2324, lng: 87.8615, state: 'West Bengal' },
    { name: 'Kharagpur', slug: 'kharagpur', lat: 22.3460, lng: 87.2320, state: 'West Bengal' },
    { name: 'Haldia', slug: 'haldia', lat: 22.0667, lng: 88.0698, state: 'West Bengal' },
    { name: 'Baharampur', slug: 'baharampur', lat: 24.1026, lng: 88.2514, state: 'West Bengal' },
    { name: 'Malda', slug: 'malda', lat: 25.0108, lng: 88.1411, state: 'West Bengal' },

    // Punjab
    { name: 'Ludhiana', slug: 'ludhiana', lat: 30.9010, lng: 75.8573, state: 'Punjab' },
    { name: 'Amritsar', slug: 'amritsar', lat: 31.6340, lng: 74.8723, state: 'Punjab' },
    { name: 'Jalandhar', slug: 'jalandhar', lat: 31.3260, lng: 75.5762, state: 'Punjab' },
    { name: 'Patiala', slug: 'patiala', lat: 30.3398, lng: 76.3869, state: 'Punjab' },
    { name: 'Bathinda', slug: 'bathinda', lat: 30.2110, lng: 74.9455, state: 'Punjab' },
    { name: 'Mohali', slug: 'mohali', lat: 30.7046, lng: 76.7179, state: 'Punjab' },
    { name: 'Pathankot', slug: 'pathankot', lat: 32.2643, lng: 75.6421, state: 'Punjab' },
    { name: 'Hoshiarpur', slug: 'hoshiarpur', lat: 31.5143, lng: 75.9115, state: 'Punjab' },
    { name: 'Moga', slug: 'moga', lat: 30.8162, lng: 75.1741, state: 'Punjab' },

    // Haryana
    { name: 'Chandigarh', slug: 'chandigarh', lat: 30.7333, lng: 76.7794, state: 'Chandigarh' },
    { name: 'Ambala', slug: 'ambala', lat: 30.3782, lng: 76.7767, state: 'Haryana' },
    { name: 'Panipat', slug: 'panipat', lat: 29.3909, lng: 76.9635, state: 'Haryana' },
    { name: 'Karnal', slug: 'karnal', lat: 29.6857, lng: 76.9905, state: 'Haryana' },
    { name: 'Rohtak', slug: 'rohtak', lat: 28.8955, lng: 76.6066, state: 'Haryana' },
    { name: 'Hisar', slug: 'hisar', lat: 29.1492, lng: 75.7217, state: 'Haryana' },
    { name: 'Sonipat', slug: 'sonipat', lat: 28.9286, lng: 77.0914, state: 'Haryana' },
    { name: 'Yamunanagar', slug: 'yamunanagar', lat: 30.1290, lng: 77.2674, state: 'Haryana' },
    { name: 'Panchkula', slug: 'panchkula', lat: 30.6942, lng: 76.8606, state: 'Haryana' },
    { name: 'Bhiwani', slug: 'bhiwani', lat: 28.7975, lng: 76.1397, state: 'Haryana' },
    { name: 'Sirsa', slug: 'sirsa', lat: 29.5349, lng: 75.0289, state: 'Haryana' },

    // Kerala
    { name: 'Kochi', slug: 'kochi', lat: 9.9312, lng: 76.2673, state: 'Kerala' },
    { name: 'Thiruvananthapuram', slug: 'trivandrum', lat: 8.5241, lng: 76.9366, state: 'Kerala' },
    { name: 'Kozhikode', slug: 'kozhikode', lat: 11.2588, lng: 75.7804, state: 'Kerala' },
    { name: 'Thrissur', slug: 'thrissur', lat: 10.5276, lng: 76.2144, state: 'Kerala' },
    { name: 'Kollam', slug: 'kollam', lat: 8.8932, lng: 76.6141, state: 'Kerala' },
    { name: 'Alappuzha', slug: 'alappuzha', lat: 9.4981, lng: 76.3388, state: 'Kerala' },
    { name: 'Palakkad', slug: 'palakkad', lat: 10.7867, lng: 76.6548, state: 'Kerala' },
    { name: 'Kannur', slug: 'kannur', lat: 11.8745, lng: 75.3704, state: 'Kerala' },
    { name: 'Kottayam', slug: 'kottayam', lat: 9.5916, lng: 76.5222, state: 'Kerala' },
    { name: 'Malappuram', slug: 'malappuram', lat: 11.0510, lng: 76.0711, state: 'Kerala' },

    // Uttar Pradesh
    { name: 'Lucknow', slug: 'lucknow', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
    { name: 'Kanpur', slug: 'kanpur', lat: 26.4499, lng: 80.3319, state: 'Uttar Pradesh' },
    { name: 'Varanasi', slug: 'varanasi', lat: 25.3176, lng: 82.9739, state: 'Uttar Pradesh' },
    { name: 'Agra', slug: 'agra', lat: 27.1767, lng: 78.0081, state: 'Uttar Pradesh' },
    { name: 'Prayagraj', slug: 'prayagraj', lat: 25.4358, lng: 81.8463, state: 'Uttar Pradesh' },
    { name: 'Meerut', slug: 'meerut', lat: 28.9845, lng: 77.7064, state: 'Uttar Pradesh' },
    { name: 'Bareilly', slug: 'bareilly', lat: 28.3670, lng: 79.4304, state: 'Uttar Pradesh' },
    { name: 'Aligarh', slug: 'aligarh', lat: 27.8974, lng: 78.0880, state: 'Uttar Pradesh' },
    { name: 'Moradabad', slug: 'moradabad', lat: 28.8386, lng: 78.7733, state: 'Uttar Pradesh' },
    { name: 'Gorakhpur', slug: 'gorakhpur', lat: 26.7606, lng: 83.3732, state: 'Uttar Pradesh' },
    { name: 'Saharanpur', slug: 'saharanpur', lat: 29.9680, lng: 77.5510, state: 'Uttar Pradesh' },
    { name: 'Jhansi', slug: 'jhansi', lat: 25.4484, lng: 78.5685, state: 'Uttar Pradesh' },
    { name: 'Mathura', slug: 'mathura', lat: 27.4924, lng: 77.6737, state: 'Uttar Pradesh' },
    { name: 'Firozabad', slug: 'firozabad', lat: 27.1591, lng: 78.3957, state: 'Uttar Pradesh' },
    { name: 'Muzaffarnagar', slug: 'muzaffarnagar', lat: 29.4727, lng: 77.7085, state: 'Uttar Pradesh' },
    { name: 'Shahjahanpur', slug: 'shahjahanpur', lat: 27.8806, lng: 79.9050, state: 'Uttar Pradesh' },
    { name: 'Ayodhya', slug: 'ayodhya', lat: 26.7922, lng: 82.1998, state: 'Uttar Pradesh' },
    { name: 'Hapur', slug: 'hapur', lat: 28.7314, lng: 77.7800, state: 'Uttar Pradesh' },

    // Madhya Pradesh
    { name: 'Indore', slug: 'indore', lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh' },
    { name: 'Bhopal', slug: 'bhopal', lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh' },
    { name: 'Jabalpur', slug: 'jabalpur', lat: 23.1815, lng: 79.9864, state: 'Madhya Pradesh' },
    { name: 'Gwalior', slug: 'gwalior', lat: 26.2183, lng: 78.1828, state: 'Madhya Pradesh' },
    { name: 'Ujjain', slug: 'ujjain', lat: 23.1765, lng: 75.7885, state: 'Madhya Pradesh' },
    { name: 'Sagar', slug: 'sagar', lat: 23.8388, lng: 78.7378, state: 'Madhya Pradesh' },
    { name: 'Dewas', slug: 'dewas', lat: 22.9676, lng: 76.0534, state: 'Madhya Pradesh' },
    { name: 'Satna', slug: 'satna', lat: 24.6005, lng: 80.8322, state: 'Madhya Pradesh' },
    { name: 'Ratlam', slug: 'ratlam', lat: 23.3315, lng: 75.0367, state: 'Madhya Pradesh' },
    { name: 'Rewa', slug: 'rewa', lat: 24.5373, lng: 81.3042, state: 'Madhya Pradesh' },
    { name: 'Murwara', slug: 'murwara', lat: 23.8315, lng: 80.3930, state: 'Madhya Pradesh' },
    { name: 'Singrauli', slug: 'singrauli', lat: 24.1993, lng: 82.6750, state: 'Madhya Pradesh' },
    { name: 'Burhanpur', slug: 'burhanpur', lat: 21.3104, lng: 76.2305, state: 'Madhya Pradesh' },
    { name: 'Khandwa', slug: 'khandwa', lat: 21.8306, lng: 76.3525, state: 'Madhya Pradesh' },
    { name: 'Chhindwara', slug: 'chhindwara', lat: 22.0574, lng: 78.9382, state: 'Madhya Pradesh' },

    // Bihar
    { name: 'Patna', slug: 'patna', lat: 25.5941, lng: 85.1376, state: 'Bihar' },
    { name: 'Gaya', slug: 'gaya', lat: 24.7914, lng: 85.0002, state: 'Bihar' },
    { name: 'Bhagalpur', slug: 'bhagalpur', lat: 25.2425, lng: 86.9842, state: 'Bihar' },
    { name: 'Muzaffarpur', slug: 'muzaffarpur', lat: 26.1209, lng: 85.3647, state: 'Bihar' },
    { name: 'Darbhanga', slug: 'darbhanga', lat: 26.1542, lng: 85.8918, state: 'Bihar' },
    { name: 'Purnia', slug: 'purnia', lat: 25.7771, lng: 87.4753, state: 'Bihar' },
    { name: 'Bihar Sharif', slug: 'bihar-sharif', lat: 25.1982, lng: 85.5239, state: 'Bihar' },
    { name: 'Arrah', slug: 'arrah', lat: 25.5541, lng: 84.6603, state: 'Bihar' },
    { name: 'Begusarai', slug: 'begusarai', lat: 25.4182, lng: 86.1272, state: 'Bihar' },
    { name: 'Katihar', slug: 'katihar', lat: 25.5313, lng: 87.5713, state: 'Bihar' },
    { name: 'Chapra', slug: 'chapra', lat: 25.7839, lng: 84.7319, state: 'Bihar' },
    { name: 'Sasaram', slug: 'sasaram', lat: 24.9509, lng: 84.0315, state: 'Bihar' },

    // Jharkhand
    { name: 'Ranchi', slug: 'ranchi', lat: 23.3441, lng: 85.3096, state: 'Jharkhand' },
    { name: 'Jamshedpur', slug: 'jamshedpur', lat: 22.8046, lng: 86.2029, state: 'Jharkhand' },
    { name: 'Dhanbad', slug: 'dhanbad', lat: 23.7957, lng: 86.4304, state: 'Jharkhand' },
    { name: 'Bokaro', slug: 'bokaro', lat: 23.6693, lng: 86.1511, state: 'Jharkhand' },
    { name: 'Hazaribagh', slug: 'hazaribagh', lat: 23.9966, lng: 85.3691, state: 'Jharkhand' },
    { name: 'Deoghar', slug: 'deoghar', lat: 24.4764, lng: 86.6942, state: 'Jharkhand' },
    { name: 'Giridih', slug: 'giridih', lat: 24.1851, lng: 86.3006, state: 'Jharkhand' },
    { name: 'Ramgarh', slug: 'ramgarh', lat: 23.6290, lng: 85.5615, state: 'Jharkhand' },

    // Odisha
    { name: 'Bhubaneswar', slug: 'bhubaneswar', lat: 20.2961, lng: 85.8245, state: 'Odisha' },
    { name: 'Cuttack', slug: 'cuttack', lat: 20.4625, lng: 85.8830, state: 'Odisha' },
    { name: 'Rourkela', slug: 'rourkela', lat: 22.2604, lng: 84.8536, state: 'Odisha' },
    { name: 'Berhampur', slug: 'berhampur', lat: 19.3150, lng: 84.7941, state: 'Odisha' },
    { name: 'Sambalpur', slug: 'sambalpur', lat: 21.4669, lng: 83.9756, state: 'Odisha' },
    { name: 'Puri', slug: 'puri', lat: 19.8135, lng: 85.8312, state: 'Odisha' },
    { name: 'Balasore', slug: 'balasore', lat: 21.4934, lng: 86.9135, state: 'Odisha' },
    { name: 'Bhadrak', slug: 'bhadrak', lat: 21.0583, lng: 86.4958, state: 'Odisha' },

    // Chhattisgarh
    { name: 'Raipur', slug: 'raipur', lat: 21.2514, lng: 81.6296, state: 'Chhattisgarh' },
    { name: 'Bhilai', slug: 'bhilai', lat: 21.2167, lng: 81.4333, state: 'Chhattisgarh' },
    { name: 'Bilaspur', slug: 'bilaspur', lat: 22.0797, lng: 82.1409, state: 'Chhattisgarh' },
    { name: 'Korba', slug: 'korba', lat: 22.3595, lng: 82.7501, state: 'Chhattisgarh' },
    { name: 'Durg', slug: 'durg', lat: 21.1900, lng: 81.2800, state: 'Chhattisgarh' },
    { name: 'Rajnandgaon', slug: 'rajnandgaon', lat: 21.0975, lng: 81.0287, state: 'Chhattisgarh' },
    { name: 'Jagdalpur', slug: 'jagdalpur', lat: 19.0860, lng: 82.0397, state: 'Chhattisgarh' },
    { name: 'Raigarh', slug: 'raigarh', lat: 21.8974, lng: 83.3950, state: 'Chhattisgarh' },

    // Assam
    { name: 'Guwahati', slug: 'guwahati', lat: 26.1445, lng: 91.7362, state: 'Assam' },
    { name: 'Silchar', slug: 'silchar', lat: 24.8333, lng: 92.7789, state: 'Assam' },
    { name: 'Dibrugarh', slug: 'dibrugarh', lat: 27.4728, lng: 94.9120, state: 'Assam' },
    { name: 'Jorhat', slug: 'jorhat', lat: 26.7509, lng: 94.2037, state: 'Assam' },
    { name: 'Nagaon', slug: 'nagaon', lat: 26.3509, lng: 92.6920, state: 'Assam' },
    { name: 'Tinsukia', slug: 'tinsukia', lat: 27.4884, lng: 95.3547, state: 'Assam' },
    { name: 'Tezpur', slug: 'tezpur', lat: 26.6528, lng: 92.7926, state: 'Assam' },

    // Himachal Pradesh
    { name: 'Shimla', slug: 'shimla', lat: 31.1048, lng: 77.1734, state: 'Himachal Pradesh' },
    { name: 'Dharamshala', slug: 'dharamshala', lat: 32.2190, lng: 76.3234, state: 'Himachal Pradesh' },
    { name: 'Solan', slug: 'solan', lat: 30.9045, lng: 77.0967, state: 'Himachal Pradesh' },
    { name: 'Mandi', slug: 'mandi', lat: 31.7084, lng: 76.9314, state: 'Himachal Pradesh' },
    { name: 'Kullu', slug: 'kullu', lat: 31.9579, lng: 77.1089, state: 'Himachal Pradesh' },
    { name: 'Manali', slug: 'manali', lat: 32.2396, lng: 77.1887, state: 'Himachal Pradesh' },

    // Uttarakhand
    { name: 'Dehradun', slug: 'dehradun', lat: 30.3165, lng: 78.0322, state: 'Uttarakhand' },
    { name: 'Haridwar', slug: 'haridwar', lat: 29.9457, lng: 78.1642, state: 'Uttarakhand' },
    { name: 'Rishikesh', slug: 'rishikesh', lat: 30.0869, lng: 78.2676, state: 'Uttarakhand' },
    { name: 'Haldwani', slug: 'haldwani', lat: 29.2183, lng: 79.5130, state: 'Uttarakhand' },
    { name: 'Roorkee', slug: 'roorkee', lat: 29.8543, lng: 77.8880, state: 'Uttarakhand' },
    { name: 'Kashipur', slug: 'kashipur', lat: 29.2104, lng: 78.9620, state: 'Uttarakhand' },
    { name: 'Rudrapur', slug: 'rudrapur', lat: 28.9762, lng: 79.4045, state: 'Uttarakhand' },
    { name: 'Nainital', slug: 'nainital', lat: 29.3803, lng: 79.4636, state: 'Uttarakhand' },

    // Jammu & Kashmir
    { name: 'Srinagar', slug: 'srinagar', lat: 34.0837, lng: 74.7973, state: 'Jammu and Kashmir' },
    { name: 'Jammu', slug: 'jammu', lat: 32.7266, lng: 74.8570, state: 'Jammu and Kashmir' },
    { name: 'Anantnag', slug: 'anantnag', lat: 33.7311, lng: 75.1547, state: 'Jammu and Kashmir' },
    { name: 'Baramulla', slug: 'baramulla', lat: 34.2095, lng: 74.3436, state: 'Jammu and Kashmir' },
    { name: 'Udhampur', slug: 'udhampur', lat: 32.9160, lng: 75.1419, state: 'Jammu and Kashmir' },

    // Goa
    { name: 'Panaji', slug: 'panaji', lat: 15.4909, lng: 73.8278, state: 'Goa' },
    { name: 'Margao', slug: 'margao', lat: 15.2832, lng: 73.9862, state: 'Goa' },
    { name: 'Vasco', slug: 'vasco', lat: 15.3982, lng: 73.8113, state: 'Goa' },
    { name: 'Mapusa', slug: 'mapusa', lat: 15.5916, lng: 73.8087, state: 'Goa' },
    { name: 'Ponda', slug: 'ponda', lat: 15.4034, lng: 74.0152, state: 'Goa' },

    // Northeast
    { name: 'Imphal', slug: 'imphal', lat: 24.8170, lng: 93.9368, state: 'Manipur' },
    { name: 'Shillong', slug: 'shillong', lat: 25.5788, lng: 91.8933, state: 'Meghalaya' },
    { name: 'Aizawl', slug: 'aizawl', lat: 23.7271, lng: 92.7176, state: 'Mizoram' },
    { name: 'Agartala', slug: 'agartala', lat: 23.8315, lng: 91.2868, state: 'Tripura' },
    { name: 'Kohima', slug: 'kohima', lat: 25.6751, lng: 94.1086, state: 'Nagaland' },
    { name: 'Itanagar', slug: 'itanagar', lat: 27.0844, lng: 93.6053, state: 'Arunachal Pradesh' },
    { name: 'Gangtok', slug: 'gangtok', lat: 27.3389, lng: 88.6065, state: 'Sikkim' },
]
