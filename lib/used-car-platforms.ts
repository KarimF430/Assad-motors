export const usedCarPlatforms = [
    // Certified / Direct Sellers
    {
        name: 'Cars24',
        logo: '🚗',
        color: 'from-orange-500 to-orange-600',
        type: 'certified',
        getUrl: (model: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const modelSlug = model.toLowerCase().replace(/\s+/g, '-')
            return `https://www.cars24.com/buy-used-${modelSlug}-cars-${citySlug}/`
        }
    },
    {
        name: 'Spinny',
        logo: '🔄',
        color: 'from-purple-500 to-purple-600',
        type: 'certified',
        getUrl: (model: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const modelSlug = model.toLowerCase().replace(/\s+/g, '-')
            return `https://www.spinny.com/used-${modelSlug}-cars-in-${citySlug}/`
        }
    },
    {
        name: 'BlueJack',
        logo: '🔵',
        color: 'from-blue-500 to-blue-600',
        type: 'certified',
        getUrl: (model: string, city: string) => {
            return `https://www.google.com/search?q=buy+used+${model}+in+${city}+bluejack`
            // BlueJack doesn't have a standardized public search URL pattern easily guessable, fallback to Google
        }
    },
    {
        name: 'Truebil',
        logo: '✅',
        color: 'from-emerald-500 to-emerald-600',
        type: 'certified',
        getUrl: (model: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const modelSlug = model.toLowerCase().replace(/\s+/g, '-')
            return `https://www.truebil.com/used-${modelSlug}-cars-in-${citySlug}`
        }
    },

    // Aggregators / Marketplaces
    {
        name: 'CarWale',
        logo: '🚙',
        color: 'from-red-500 to-red-600',
        type: 'marketplace',
        getUrl: (model: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const modelSlug = model.toLowerCase().replace(/\s+/g, '-')
            return `https://www.carwale.com/used/${modelSlug}-cars-in-${citySlug}/`
        }
    },
    {
        name: 'CarDekho',
        logo: '🔍',
        color: 'from-green-500 to-green-600',
        type: 'marketplace',
        getUrl: (model: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const modelSlug = model.toLowerCase().replace(/\s+/g, '-')
            return `https://www.cardekho.com/used-${modelSlug}+cars+in+${citySlug}`
        }
    },
    {
        name: 'Droom',
        logo: '💎',
        color: 'from-teal-500 to-teal-600',
        type: 'marketplace',
        getUrl: (model: string, city: string) => {
            const citySlug = city.toLowerCase()
            const modelSlug = model.toLowerCase().replace(/\s+/g, '-')
            return `https://droom.in/cars/used/${modelSlug}/${citySlug}`
        }
    },
    {
        name: 'CarTrade',
        logo: '💼',
        color: 'from-indigo-500 to-indigo-600',
        type: 'marketplace',
        getUrl: (model: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const modelSlug = model.toLowerCase().replace(/\s+/g, '-')
            return `https://www.cartrade.com/buy-used-cars/${citySlug}/${modelSlug}`
        }
    },
    {
        name: 'OLX Autos',
        logo: '📱',
        color: 'from-cyan-500 to-cyan-600',
        type: 'classifieds',
        getUrl: (model: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const modelSlug = model.toLowerCase().replace(/\s+/g, '-')
            return `https://www.olx.in/${citySlug}_g4058877/q-${modelSlug}`
        }
    },
    {
        name: 'Quikr Cars',
        logo: '⚡',
        color: 'from-yellow-500 to-yellow-600',
        type: 'classifieds',
        getUrl: (model: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const modelSlug = model.toLowerCase().replace(/\s+/g, '-')
            return `https://www.quikr.com/cars-bikes/used-${modelSlug}-cars-in-${citySlug}`
        }
    },
    {
        name: 'Facebook Marketplace',
        logo: '📘',
        color: 'from-blue-600 to-blue-700',
        type: 'classifieds',
        getUrl: (model: string, city: string) => {
            const query = `${model} in ${city}`
            return `https://www.facebook.com/marketplace/category/vehicles?query=${encodeURIComponent(query)}`
        }
    },

    // OEM / Brand Certified
    {
        name: 'Maruti True Value',
        logo: 'M',
        color: 'from-blue-700 to-blue-800',
        type: 'oem',
        getUrl: (model: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            // Maruti usually requires specific model IDs in URL, so we search generically or land on city page
            return `https://www.marutitruevalue.com/used-cars-in-${citySlug}`
        }
    },
    {
        name: 'Mahindra First Choice',
        logo: '🛡️',
        color: 'from-red-700 to-red-800',
        type: 'oem',
        getUrl: (model: string, city: string) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const modelSlug = model.toLowerCase().replace(/\s+/g, '-')
            return `https://www.mahindrafirstchoice.com/used-cars/${citySlug}/${modelSlug}`
        }
    },
    {
        name: 'Hyundai Promise',
        logo: 'H',
        color: 'from-blue-800 to-blue-900',
        type: 'oem',
        getUrl: (model: string, city: string) => {
            // HPromise usage is tricky, best to land on search
            return `https://hpromise.hyundai.co.in/used-car/buy?city=${city}&model=${model}`
        }
    },
    {
        name: 'Toyota U Trust',
        logo: 'T',
        color: 'from-red-600 to-red-700',
        type: 'oem',
        getUrl: (model: string, city: string) => {
            return `https://www.toyotabharat.com/utrust/used-cars`
        }
    },
    {
        name: 'Honda Auto Terrace',
        logo: 'H',
        color: 'from-red-500 to-red-600',
        type: 'oem',
        getUrl: (model: string, city: string) => {
            return `https://www.hondaautoterrace.com/used-cars/buy/`
        }
    }
]

export const getPlatformIcon = (name: string) => {
    const platform = usedCarPlatforms.find(p => p.name === name)
    return platform ? platform.logo : '🚗'
}
