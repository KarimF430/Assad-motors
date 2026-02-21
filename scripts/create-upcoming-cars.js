const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5001';

// 10 Upcoming car models with complete data
const upcomingCars = [
    {
        name: 'Thar 5-Door',
        brandId: 'brand-mahindra',
        expectedPriceMin: 1500000,
        expectedPriceMax: 2200000,
        expectedLaunchDate: '2025-08',
        fuelTypes: ['Petrol', 'Diesel'],
        bodyType: 'SUV',
        subBodyType: 'Compact SUV',
        headerSeo: 'The upcoming Mahindra Thar 5-Door is set to launch in August 2025. It will feature a longer wheelbase, more practical 5-door configuration, and enhanced comfort features while retaining the iconic Thar design and off-road capabilities.',
        description: '• The Thar 5-Door brings enhanced practicality with easier rear seat access and more interior space.\\n• Expected to feature modern infotainment system, improved NVH levels, and premium interior materials.\\n• Will retain the iconic Thar design language with signature grille and round headlamps.',
        exteriorDesign: '• The 5-door version will have a longer wheelbase for improved rear legroom and boot space.\\n• Expected to get LED headlamps, LED tail lamps, and new alloy wheel designs.\\n• Will maintain the boxy SUV silhouette with enhanced aerodynamics.',
        comfortConvenience: '• Likely to feature automatic climate control, larger touchscreen infotainment, and premium upholstery.\\n• Expected to get ventilated front seats, wireless charging, and multiple USB ports.\\n• Will offer improved sound insulation and ride quality compared to the 3-door version.',
        pros: ['Iconic Thar design with added practicality', 'Powerful engine options with 4x4 capability', 'Enhanced comfort and modern features', 'Strong brand value and resale potential'],
        cons: ['Expected to be pricier than 3-door version', 'Fuel efficiency might be lower due to increased weight', 'May lose some of the compact charm of original Thar'],
        engineSummaries: [
            {
                title: '2.0 Litre Turbo Petrol',
                summary: 'The 2.0-litre mStallion turbo petrol engine delivers strong performance with excellent low-end torque, making it ideal for both city driving and off-road adventures.',
                transmission: 'manual',
                power: '150 Bhp',
                torque: '300 Nm',
                speed: '6-Speed'
            },
            {
                title: '2.0 Litre Turbo Petrol',
                summary: 'The automatic transmission variant offers smooth gear shifts and better fuel efficiency in city conditions while maintaining off-road capability.',
                transmission: 'automatic',
                power: '150 Bhp',
                torque: '300 Nm',
                speed: '6-Speed'
            },
            {
                title: '2.2 Litre Diesel',
                summary: 'The proven 2.2-litre mHawk diesel engine provides excellent torque delivery and fuel efficiency, perfect for long highway journeys and off-road excursions.',
                transmission: 'manual',
                power: '130 Bhp',
                torque: '300 Nm',
                speed: '6-Speed'
            },
            {
                title: '2.2 Litre Diesel',
                summary: 'The diesel automatic variant combines convenience with capability, offering smooth power delivery and excellent low-speed control for off-roading.',
                transmission: 'automatic',
                power: '130 Bhp',
                torque: '300 Nm',
                speed: '6-Speed'
            }
        ],
        mileageData: [
            {
                engineName: '2.0 Litre Turbo Petrol Manual',
                companyClaimed: '12 Kmpl',
                cityRealWorld: '9 Kmpl',
                highwayRealWorld: '13 Kmpl'
            },
            {
                engineName: '2.0 Litre Turbo Petrol Automatic',
                companyClaimed: '11 Kmpl',
                cityRealWorld: '8.5 Kmpl',
                highwayRealWorld: '12 Kmpl'
            },
            {
                engineName: '2.2 Litre Diesel Manual',
                companyClaimed: '15 Kmpl',
                cityRealWorld: '12 Kmpl',
                highwayRealWorld: '16 Kmpl'
            },
            {
                engineName: '2.2 Litre Diesel Automatic',
                companyClaimed: '14 Kmpl',
                cityRealWorld: '11 Kmpl',
                highwayRealWorld: '15 Kmpl'
            }
        ],
        faqs: [
            {
                question: 'When will the Mahindra Thar 5-Door be launched?',
                answer: 'The Mahindra Thar 5-Door is expected to launch in August 2025 with bookings likely to open a month before the official launch.'
            },
            {
                question: 'What will be the price of Thar 5-Door?',
                answer: 'The Thar 5-Door is expected to be priced between ₹15 lakh to ₹22 lakh (ex-showroom), positioning it as a premium offering in the compact SUV segment.'
            },
            {
                question: 'Will Thar 5-Door have 4x4?',
                answer: 'Yes, the Thar 5-Door is expected to retain the 4x4 capability with both low and high range transfer case, maintaining its off-road DNA.'
            },
            {
                question: 'How is Thar 5-Door different from 3-door version?',
                answer: 'The 5-door version will have a longer wheelbase, more interior space, easier rear seat access, and enhanced comfort features while retaining the iconic Thar design and off-road capabilities.'
            }
        ]
    },
    {
        name: 'Nexon EV Long Range',
        brandId: 'brand-tata-motors',
        expectedPriceMin: 1800000,
        expectedPriceMax: 2100000,
        expectedLaunchDate: '2025-06',
        fuelTypes: ['Electric'],
        bodyType: 'SUV',
        subBodyType: 'Compact SUV',
        headerSeo: 'The upcoming Tata Nexon EV Long Range is set to launch in June 2025. It will feature a larger battery pack offering over 500km range, faster charging capabilities, and enhanced features making it one of the most practical electric SUVs in India.',
        description: '• The Nexon EV Long Range will feature a 50+ kWh battery pack offering real-world range of over 450km.\\n• Expected to support 100kW fast charging, enabling 10-80% charge in under 40 minutes.\\n• Will come with advanced ADAS features and premium interior appointments.',
        exteriorDesign: '• The Long Range variant will feature unique design elements including new alloy wheels and special badging.\\n• Expected to get connected LED light bar at the rear and refreshed front grille design.\\n• Will maintain the muscular SUV stance with improved aerodynamics for better range.',
        comfortConvenience: '• Likely to feature a larger 12.3-inch touchscreen, digital instrument cluster, and premium JBL sound system.\\n• Expected to get ventilated seats, air purifier, and wireless phone charging.\\n• Will offer multiple drive modes and regenerative braking levels for optimized range.',
        pros: ['Extended range of over 500km', 'Fast charging capability', 'Proven Nexon platform with EV expertise', 'Comprehensive warranty on battery'],
        cons: ['Higher price compared to standard Nexon EV', 'Charging infrastructure still developing', 'Slightly increased weight may affect handling'],
        engineSummaries: [
            {
                title: 'Permanent Magnet Synchronous Motor',
                summary: 'The electric motor delivers instant torque and smooth acceleration, providing a refined and silent driving experience perfect for city commutes.',
                transmission: 'automatic',
                power: '150 Bhp',
                torque: '350 Nm',
                speed: 'Single Speed'
            }
        ],
        mileageData: [
            {
                engineName: 'Electric Motor',
                companyClaimed: '500 Km',
                cityRealWorld: '450 Km',
                highwayRealWorld: '400 Km'
            }
        ],
        faqs: [
            {
                question: 'What is the range of Nexon EV Long Range?',
                answer: 'The Nexon EV Long Range is expected to offer a certified range of over 500km (MIDC) with real-world range of around 450km in mixed driving conditions.'
            },
            {
                question: 'How long does it take to charge?',
                answer: 'With a 100kW DC fast charger, the Nexon EV Long Range can charge from 10-80% in approximately 40 minutes. Home charging (7.2kW AC) will take around 8-9 hours for full charge.'
            },
            {
                question: 'What is the battery warranty?',
                answer: 'Tata is expected to offer an 8-year/160,000 km warranty on the battery pack, ensuring long-term peace of mind for buyers.'
            }
        ]
    },
    {
        name: 'XUV500 2025',
        brandId: 'brand-mahindra',
        expectedPriceMin: 1600000,
        expectedPriceMax: 2400000,
        expectedLaunchDate: '2025-09',
        fuelTypes: ['Petrol', 'Diesel'],
        bodyType: 'SUV',
        subBodyType: 'Mid-Size SUV',
        headerSeo: 'The all-new Mahindra XUV500 2025 is set to launch in September 2025. Built on a new platform, it will feature modern design, advanced technology, and powerful engine options, positioning it as a premium 7-seater SUV.',
        description: '• The new XUV500 will be built on an all-new platform offering better dynamics and safety.\\n• Expected to feature Level 2 ADAS, panoramic sunroof, and premium interior materials.\\n• Will offer both 6 and 7-seater configurations with captain seats option.',
        exteriorDesign: '• The 2025 XUV500 will feature Mahindra\'s new design language with bold grille and sleek LED lighting.\\n• Expected to get flush door handles, connected LED tail lamps, and 19-inch alloy wheels.\\n• Will have a commanding road presence with muscular proportions and premium finish.',
        comfortConvenience: '• Likely to feature dual-screen setup, 360-degree camera, and wireless Android Auto/Apple CarPlay.\\n• Expected to get tri-zone climate control, powered tailgate, and ambient lighting.\\n• Will offer premium Nappa leather upholstery and ventilated seats in all three rows.',
        pros: ['Spacious 7-seater with premium features', 'Powerful engine options', 'Advanced safety and technology', 'Strong brand heritage'],
        cons: ['Expected to be priced premium', 'Third row may be tight for adults', 'Fuel efficiency might be average'],
        engineSummaries: [
            {
                title: '2.0 Litre Turbo Petrol',
                summary: 'The powerful 2.0-litre turbo petrol engine delivers strong performance with excellent refinement, making it ideal for highway cruising and city driving.',
                transmission: 'manual',
                power: '200 Bhp',
                torque: '380 Nm',
                speed: '6-Speed'
            },
            {
                title: '2.0 Litre Turbo Petrol',
                summary: 'The automatic transmission variant offers smooth shifts and better fuel efficiency while maintaining the strong performance characteristics.',
                transmission: 'automatic',
                power: '200 Bhp',
                torque: '380 Nm',
                speed: '6-Speed'
            },
            {
                title: '2.2 Litre Diesel',
                summary: 'The proven 2.2-litre diesel engine provides excellent torque and fuel efficiency, perfect for long-distance travel and heavy loads.',
                transmission: 'manual',
                power: '185 Bhp',
                torque: '420 Nm',
                speed: '6-Speed'
            },
            {
                title: '2.2 Litre Diesel',
                summary: 'The diesel automatic combines convenience with capability, offering smooth power delivery and excellent highway performance.',
                transmission: 'automatic',
                power: '185 Bhp',
                torque: '420 Nm',
                speed: '6-Speed'
            }
        ],
        mileageData: [
            {
                engineName: '2.0 Litre Turbo Petrol Manual',
                companyClaimed: '13 Kmpl',
                cityRealWorld: '10 Kmpl',
                highwayRealWorld: '14 Kmpl'
            },
            {
                engineName: '2.0 Litre Turbo Petrol Automatic',
                companyClaimed: '12 Kmpl',
                cityRealWorld: '9.5 Kmpl',
                highwayRealWorld: '13 Kmpl'
            },
            {
                engineName: '2.2 Litre Diesel Manual',
                companyClaimed: '16 Kmpl',
                cityRealWorld: '13 Kmpl',
                highwayRealWorld: '17 Kmpl'
            },
            {
                engineName: '2.2 Litre Diesel Automatic',
                companyClaimed: '15 Kmpl',
                cityRealWorld: '12 Kmpl',
                highwayRealWorld: '16 Kmpl'
            }
        ],
        faqs: [
            {
                question: 'When will the new XUV500 launch?',
                answer: 'The all-new Mahindra XUV500 is expected to launch in September 2025 with bookings opening a month prior to the launch.'
            },
            {
                question: 'Will it have 7 seats?',
                answer: 'Yes, the XUV500 will be available in both 6-seater (captain seats in second row) and 7-seater configurations.'
            },
            {
                question: 'What features will it have?',
                answer: 'The XUV500 is expected to feature Level 2 ADAS, panoramic sunroof, dual-screen setup, 360-degree camera, ventilated seats, and premium Nappa leather upholstery.'
            }
        ]
    },
    {
        name: 'Curvv EV',
        brandId: 'brand-tata-motors',
        expectedPriceMin: 1600000,
        expectedPriceMax: 2200000,
        expectedLaunchDate: '2025-04',
        fuelTypes: ['Electric'],
        bodyType: 'SUV',
        subBodyType: 'Coupe SUV',
        headerSeo: 'The Tata Curvv EV is a stylish coupe SUV set to launch in April 2025. It combines the practicality of an SUV with the sporty design of a coupe, offering a unique proposition in the electric vehicle segment.',
        description: '• The Curvv EV introduces a new coupe SUV body style to the mass market segment.\\n• Expected to offer a range of up to 500km on a single charge.\\n• Will feature a minimalist interior design with advanced connectivity features.',
        exteriorDesign: '• The Curvv EV features a sloping roofline, flush door handles, and aero-optimized wheels.\\n• Expected to get a full-width LED light bar at the front and rear.\\n• Will have a high ground clearance and rugged cladding for SUV appeal.',
        comfortConvenience: '• Likely to feature a large 12.3-inch touchscreen, digital instrument cluster, and panoramic sunroof.\\n• Expected to get ventilated seats, 360-degree camera, and ADAS Level 2.\\n• Will offer V2L (Vehicle to Load) capability to power external appliances.',
        pros: ['Unique coupe SUV design', 'Long range and fast charging', 'Advanced features and tech', 'Spacious boot despite coupe roofline'],
        cons: ['Rear headroom might be compromised', 'Expected to be priced at a premium', 'Rear visibility could be limited'],
        engineSummaries: [
            {
                title: 'Permanent Magnet Synchronous Motor',
                summary: 'The electric motor delivers instant torque and smooth acceleration, providing a refined and silent driving experience.',
                transmission: 'automatic',
                power: '145 Bhp',
                torque: '310 Nm',
                speed: 'Single Speed'
            }
        ],
        mileageData: [
            {
                engineName: 'Electric Motor',
                companyClaimed: '500 Km',
                cityRealWorld: '420 Km',
                highwayRealWorld: '380 Km'
            }
        ],
        faqs: [
            {
                question: 'What is the range of Tata Curvv EV?',
                answer: 'The Tata Curvv EV is expected to offer a certified range of up to 500km with a real-world range of around 400-420km.'
            },
            {
                question: 'Is it an SUV or a Coupe?',
                answer: 'The Curvv EV is a Coupe SUV, combining the high ground clearance and ruggedness of an SUV with the sloping roofline of a coupe.'
            },
            {
                question: 'When will bookings open?',
                answer: 'Bookings for the Tata Curvv EV are expected to open in March 2025, a month before the official launch.'
            }
        ]
    },
    {
        name: 'Swift 2025',
        brandId: 'brand-maruti-suzuki',
        expectedPriceMin: 650000,
        expectedPriceMax: 1000000,
        expectedLaunchDate: '2025-05',
        fuelTypes: ['Petrol', 'CNG'],
        bodyType: 'Hatchback',
        subBodyType: 'Compact Hatchback',
        headerSeo: 'The new-gen Maruti Suzuki Swift 2025 is coming in May 2025 with a fresh design, new engine, and enhanced features. It promises better fuel efficiency and safety while retaining the fun-to-drive character.',
        description: '• The 2025 Swift gets a sharper design, new Z-series engine, and improved safety features.\\n• Expected to offer best-in-class fuel efficiency of up to 25 kmpl.\\n• Will feature a modernized interior with a floating touchscreen and new dashboard layout.',
        exteriorDesign: '• The new Swift features a redesigned grille, sharper LED headlamps, and new alloy wheels.\\n• The rear door handles are moved back to the conventional position.\\n• Will be available in new vibrant color options including dual-tone schemes.',
        comfortConvenience: '• Likely to feature a 9-inch SmartPlay Pro+ touchscreen, wireless charging, and Arkamys sound system.\\n• Expected to get rear AC vents, cruise control, and 6 airbags as standard.\\n• Will offer improved seat comfort and slightly more boot space.',
        pros: ['High fuel efficiency', 'Fun to drive dynamics', 'Low maintenance cost', 'Improved safety features'],
        cons: ['AMT gearbox might be jerky', 'Rear seat space is average', 'Build quality might still be light'],
        engineSummaries: [
            {
                title: '1.2 Litre Z-Series Petrol',
                summary: 'The new 3-cylinder Z-series engine focuses on fuel efficiency and low-end torque, making it perfect for city driving.',
                transmission: 'manual',
                power: '82 Bhp',
                torque: '112 Nm',
                speed: '5-Speed'
            },
            {
                title: '1.2 Litre Z-Series Petrol',
                summary: 'The AMT variant offers convenience for city traffic with improved shift logic for smoother gear changes.',
                transmission: 'automatic',
                power: '82 Bhp',
                torque: '112 Nm',
                speed: '5-Speed AMT'
            }
        ],
        mileageData: [
            {
                engineName: '1.2 Litre Petrol Manual',
                companyClaimed: '25.7 Kmpl',
                cityRealWorld: '20 Kmpl',
                highwayRealWorld: '24 Kmpl'
            },
            {
                engineName: '1.2 Litre Petrol AMT',
                companyClaimed: '26 Kmpl',
                cityRealWorld: '19 Kmpl',
                highwayRealWorld: '23 Kmpl'
            }
        ],
        faqs: [
            {
                question: 'What is the mileage of new Swift 2025?',
                answer: 'The new Swift 2025 is expected to deliver a mileage of up to 25.7 kmpl for the manual variant and 26 kmpl for the AMT variant.'
            },
            {
                question: 'Is it a 3-cylinder engine?',
                answer: 'Yes, the new Swift will be powered by a new 1.2-litre 3-cylinder Z-series petrol engine, replacing the current 4-cylinder K-series unit.'
            },
            {
                question: 'Will it have a sunroof?',
                answer: 'No, the new Swift is not expected to feature a sunroof, focusing instead on practical features and fuel efficiency.'
            }
        ]
    },
    {
        name: 'Amaze 2025',
        brandId: 'brand-honda',
        expectedPriceMin: 750000,
        expectedPriceMax: 1050000,
        expectedLaunchDate: '2025-07',
        fuelTypes: ['Petrol'],
        bodyType: 'Sedan',
        subBodyType: 'Compact Sedan',
        headerSeo: 'The next-gen Honda Amaze 2025 is launching in July 2025. Based on a modified City platform, it will offer premium design, more space, and advanced features, raising the bar in the compact sedan segment.',
        description: '• The new Amaze will feature a more premium design inspired by the City and Accord.\\n• Expected to offer ADAS features, a first in the compact sedan segment.\\n• Will continue with the reliable 1.2L i-VTEC engine and CVT gearbox.',
        exteriorDesign: '• The 2025 Amaze gets a sleek front fascia with LED headlamps and a chrome grille.\\n• Expected to have a more coupe-like roofline and new LED tail lamps.\\n• Will feature larger 15-inch alloy wheels and a shark fin antenna.',
        comfortConvenience: '• Likely to feature a larger touchscreen, sunroof, and wireless charger.\\n• Expected to get improved seat cushioning and enhanced rear legroom.\\n• Will offer keyless entry, push-button start, and paddle shifters (CVT).',
        pros: ['Premium design and build', 'Spacious and comfortable cabin', 'Smooth CVT gearbox', 'Reliable petrol engine'],
        cons: ['No diesel engine option', 'Ground clearance might be an issue', 'Service network smaller than Maruti/Hyundai'],
        engineSummaries: [
            {
                title: '1.2 Litre i-VTEC Petrol',
                summary: 'The refined 1.2L i-VTEC engine offers a balance of performance and efficiency, with linear power delivery.',
                transmission: 'manual',
                power: '90 Bhp',
                torque: '110 Nm',
                speed: '5-Speed'
            },
            {
                title: '1.2 Litre i-VTEC Petrol',
                summary: 'The CVT variant provides a seamless driving experience, perfect for city traffic, with paddle shifters for manual control.',
                transmission: 'automatic',
                power: '90 Bhp',
                torque: '110 Nm',
                speed: 'CVT'
            }
        ],
        mileageData: [
            {
                engineName: '1.2 Litre Petrol Manual',
                companyClaimed: '19 Kmpl',
                cityRealWorld: '15 Kmpl',
                highwayRealWorld: '18 Kmpl'
            },
            {
                engineName: '1.2 Litre Petrol CVT',
                companyClaimed: '18.5 Kmpl',
                cityRealWorld: '14 Kmpl',
                highwayRealWorld: '17 Kmpl'
            }
        ],
        faqs: [
            {
                question: 'Will the new Amaze have a sunroof?',
                answer: 'Yes, the top variants of the new Honda Amaze 2025 are expected to feature a single-pane electric sunroof.'
            },
            {
                question: 'Is diesel engine available?',
                answer: 'No, Honda has discontinued diesel engines in India, so the new Amaze will be available only with a petrol engine.'
            },
            {
                question: 'Will it get ADAS?',
                answer: 'Yes, the new Amaze is expected to feature Honda Sensing (ADAS) suite, including collision mitigation braking and lane keep assist.'
            }
        ]
    },
    {
        name: 'Cloud EV',
        brandId: 'brand-mg-motor',
        expectedPriceMin: 2000000,
        expectedPriceMax: 2500000,
        expectedLaunchDate: '2025-08',
        fuelTypes: ['Electric'],
        bodyType: 'Hatchback',
        subBodyType: 'Crossover',
        headerSeo: 'The MG Cloud EV is a unique crossover MPV set to launch in August 2025. It focuses on maximum interior space and comfort, offering a lounge-like experience with a range of up to 460km.',
        description: '• The Cloud EV features a unique MPV-crossover design maximizing interior space.\\n• Expected to offer "sofa mode" seats that recline fully for resting.\\n• Will come with a large 15.6-inch touchscreen and advanced ADAS features.',
        exteriorDesign: '• The design is clean and minimalist with flush door handles and full-width LED lights.\\n• Features a tall boy stance for easy ingress/egress and excellent headroom.\\n• Will ride on 18-inch aero alloy wheels for better efficiency.',
        comfortConvenience: '• Likely to feature quilted leather seats, 360-degree camera, and powered tailgate.\\n• Expected to get a large panoramic sunroof and ambient lighting.\\n• Will offer extensive connected car features and OTA updates.',
        pros: ['Extremely spacious interior', 'Unique "sofa mode" seating', 'Premium features and tech', 'Comfortable ride quality'],
        cons: ['Unconventional styling might not appeal to all', 'Large size might be tricky in tight traffic', 'Brand perception vs established rivals'],
        engineSummaries: [
            {
                title: 'Permanent Magnet Synchronous Motor',
                summary: 'The front-mounted motor provides smooth and linear power delivery, adequate for city and highway driving.',
                transmission: 'automatic',
                power: '134 Bhp',
                torque: '200 Nm',
                speed: 'Single Speed'
            }
        ],
        mileageData: [
            {
                engineName: 'Electric Motor',
                companyClaimed: '460 Km',
                cityRealWorld: '380 Km',
                highwayRealWorld: '340 Km'
            }
        ],
        faqs: [
            {
                question: 'What is the range of MG Cloud EV?',
                answer: 'The MG Cloud EV is expected to offer a range of up to 460km on a single charge with a 50.6 kWh battery pack.'
            },
            {
                question: 'Is it a 7-seater?',
                answer: 'No, the MG Cloud EV is a 5-seater crossover, but it focuses on maximizing space and comfort for all 5 passengers.'
            },
            {
                question: 'What is "Sofa Mode"?',
                answer: 'The front seats can be fully reclined to join with the rear seats, creating a flat, sofa-like surface for resting when the car is stationary.'
            }
        ]
    },
    {
        name: 'Skyraptor',
        brandId: 'brand-tata-motors',
        expectedPriceMin: 2500000,
        expectedPriceMax: 3000000,
        expectedLaunchDate: '2025-10',
        fuelTypes: ['Electric'],
        bodyType: 'SUV',
        subBodyType: 'Off-road SUV',
        headerSeo: 'The Tata Skyraptor is a rugged electric SUV concept turning into reality in October 2025. Based on the Harrier EV, it adds serious off-road hardware and aggressive styling for adventure enthusiasts.',
        description: '• The Skyraptor is the off-road focused version of the Harrier EV.\\n• Expected to feature dual-motor AWD setup with terrain response modes.\\n• Will come with rugged styling, all-terrain tyres, and increased ground clearance.',
        exteriorDesign: '• Features aggressive bumpers, skid plates, and roof rails with auxiliary lights.\\n• Expected to get unique color options and "Skyraptor" badging.\\n• Will ride on special off-road wheels and tyres for better grip.',
        comfortConvenience: '• Likely to feature water-resistant upholstery and rubberized floor mats.\\n• Expected to get a large touchscreen with off-road telemetry and 360-degree camera.\\n• Will offer V2L capability for camping and outdoor activities.',
        pros: ['Serious off-road capability', 'Zero emissions adventure', 'Rugged and durable build', 'Advanced AWD system'],
        cons: ['Range might be lower due to off-road tyres', 'Expensive proposition', 'Large dimensions for city use'],
        engineSummaries: [
            {
                title: 'Dual Motor AWD',
                summary: 'The dual-motor setup provides all-wheel drive capability with instant torque vectoring for superior off-road traction.',
                transmission: 'automatic',
                power: '300 Bhp',
                torque: '600 Nm',
                speed: 'Single Speed'
            }
        ],
        mileageData: [
            {
                engineName: 'Electric Motor',
                companyClaimed: '450 Km',
                cityRealWorld: '350 Km',
                highwayRealWorld: '300 Km'
            }
        ],
        faqs: [
            {
                question: 'Is Skyraptor 4x4?',
                answer: 'Yes, the Skyraptor features a dual-motor All-Wheel Drive (AWD) system that provides 4x4 capabilities electronically.'
            },
            {
                question: 'What is the ground clearance?',
                answer: 'The Skyraptor is expected to have a ground clearance of over 205mm, suitable for serious off-roading.'
            },
            {
                question: 'Based on which car?',
                answer: 'The Skyraptor is based on the Harrier EV platform but modified for enhanced off-road performance and durability.'
            }
        ]
    },
    {
        name: 'Alcazar 2025',
        brandId: 'brand-hyundai',
        expectedPriceMin: 1700000,
        expectedPriceMax: 2300000,
        expectedLaunchDate: '2025-06',
        fuelTypes: ['Petrol', 'Diesel'],
        bodyType: 'SUV',
        subBodyType: '3-Row SUV',
        headerSeo: 'The facelifted Hyundai Alcazar 2025 is launching in June 2025. It brings the new Creta-inspired design, updated interiors, and ADAS features to the popular 6/7-seater SUV.',
        description: '• The 2025 Alcazar gets a comprehensive facelift with new front and rear design.\\n• Expected to feature dual 10.25-inch screens and Level 2 ADAS.\\n• Will continue to offer 1.5L Turbo Petrol and 1.5L Diesel engine options.',
        exteriorDesign: '• Features a new grille with H-shaped LED DRLs and connected tail lamps.\\n• Expected to get new 18-inch diamond-cut alloy wheels.\\n• Will have a more upright stance and premium chrome elements.',
        comfortConvenience: '• Likely to feature dual-zone climate control, ventilated seats (front & 2nd row), and panoramic sunroof.\\n• Expected to get powered driver seat with memory and boss mode for rear passenger.\\n• Will offer 6 and 7-seater options with improved cushioning.',
        pros: ['Premium and feature-rich interior', 'Refined engine options', 'Comfortable ride quality', 'Good resale value'],
        cons: ['Third row is best for kids', 'No hybrid option', 'Price increase expected with facelift'],
        engineSummaries: [
            {
                title: '1.5 Litre Turbo Petrol',
                summary: 'The 1.5L turbo petrol engine offers spirited performance and is the most powerful in its segment.',
                transmission: 'manual',
                power: '160 Bhp',
                torque: '253 Nm',
                speed: '6-Speed'
            },
            {
                title: '1.5 Litre Turbo Petrol',
                summary: 'The DCT variant offers lightning-fast shifts and makes driving this large SUV effortless.',
                transmission: 'automatic',
                power: '160 Bhp',
                torque: '253 Nm',
                speed: '7-Speed DCT'
            },
            {
                title: '1.5 Litre Diesel',
                summary: 'The refined diesel engine is perfect for long highway runs with excellent fuel efficiency.',
                transmission: 'manual',
                power: '116 Bhp',
                torque: '250 Nm',
                speed: '6-Speed'
            },
            {
                title: '1.5 Litre Diesel',
                summary: 'The diesel automatic is a great cruiser, offering convenience and efficiency for family trips.',
                transmission: 'automatic',
                power: '116 Bhp',
                torque: '250 Nm',
                speed: '6-Speed AT'
            }
        ],
        mileageData: [
            {
                engineName: '1.5 Litre Turbo Petrol Manual',
                companyClaimed: '17.5 Kmpl',
                cityRealWorld: '12 Kmpl',
                highwayRealWorld: '16 Kmpl'
            },
            {
                engineName: '1.5 Litre Turbo Petrol DCT',
                companyClaimed: '18 Kmpl',
                cityRealWorld: '11 Kmpl',
                highwayRealWorld: '15 Kmpl'
            },
            {
                engineName: '1.5 Litre Diesel Manual',
                companyClaimed: '20.4 Kmpl',
                cityRealWorld: '16 Kmpl',
                highwayRealWorld: '19 Kmpl'
            },
            {
                engineName: '1.5 Litre Diesel AT',
                companyClaimed: '19 Kmpl',
                cityRealWorld: '15 Kmpl',
                highwayRealWorld: '18 Kmpl'
            }
        ],
        faqs: [
            {
                question: 'Does Alcazar have ADAS?',
                answer: 'Yes, the 2025 Alcazar facelift will come equipped with Level 2 ADAS features like adaptive cruise control and lane keep assist.'
            },
            {
                question: 'Is it available in 7-seater?',
                answer: 'Yes, the Alcazar is available in both 6-seater (with captain seats) and 7-seater (with bench seat) configurations.'
            },
            {
                question: 'What is the mileage of diesel?',
                answer: 'The diesel variant of the Alcazar offers a claimed mileage of up to 20.4 kmpl, making it very efficient for a 7-seater.'
            }
        ]
    },
    {
        name: 'Kodiaq 2025',
        brandId: 'brand-skoda',
        expectedPriceMin: 4000000,
        expectedPriceMax: 4500000,
        expectedLaunchDate: '2025-11',
        fuelTypes: ['Petrol'],
        bodyType: 'SUV',
        subBodyType: 'Luxury SUV',
        headerSeo: 'The new-generation Skoda Kodiaq 2025 is launching in November 2025. It features a bolder design, more space, and advanced technology, continuing its legacy as a premium 7-seater SUV.',
        description: '• The new Kodiaq gets a more rugged design with a larger grille and matrix LED headlights.\\n• Expected to feature a 13-inch touchscreen and smart dials for climate control.\\n• Will be powered by the 2.0L TSI engine with improved efficiency.',
        exteriorDesign: '• Features a squared-off wheel arches, connected tail lamps, and a D-pillar trim in unique finish.\\n• Expected to get new 19-inch alloy wheels and a light bar in the grille.\\n• Will be larger than the outgoing model, offering more interior space.',
        comfortConvenience: '• Likely to feature massage seats, tri-zone climate control, and Canton sound system.\\n• Expected to get a head-up display, park assist, and dynamic chassis control (DCC).\\n• Will offer clever storage solutions and a massive boot (in 5-seat mode).',
        pros: ['Luxurious and spacious cabin', 'Powerful TSI engine', 'Excellent ride and handling balance', 'Simply Clever features'],
        cons: ['No diesel engine option', 'Price will be high', 'Service costs can be higher than rivals'],
        engineSummaries: [
            {
                title: '2.0 Litre TSI Petrol',
                summary: 'The 2.0L TSI engine is a gem, offering strong acceleration and refinement that matches luxury cars.',
                transmission: 'automatic',
                power: '190 Bhp',
                torque: '320 Nm',
                speed: '7-Speed DSG'
            }
        ],
        mileageData: [
            {
                engineName: '2.0 Litre TSI Petrol DSG',
                companyClaimed: '13 Kmpl',
                cityRealWorld: '9 Kmpl',
                highwayRealWorld: '14 Kmpl'
            }
        ],
        faqs: [
            {
                question: 'Is diesel available in new Kodiaq?',
                answer: 'No, Skoda has discontinued diesel engines in India, so the new Kodiaq will only be available with the 2.0L TSI petrol engine.'
            },
            {
                question: 'How many seats does it have?',
                answer: 'The Kodiaq is a 7-seater SUV, but the third row is best suited for children or short adults for short journeys.'
            },
            {
                question: 'Does it have 4x4?',
                answer: 'Yes, the Kodiaq comes standard with a 4x4 system that offers excellent grip and stability in all conditions.'
            }
        ]
    }
];

console.log('Upcoming cars data structure created. Total cars:', upcomingCars.length);
console.log('Ready to create variants for each model.');

async function createUpcomingCars() {
    console.log('Starting creation of 10 upcoming cars...');

    for (const car of upcomingCars) {
        try {
            console.log(`Creating ${car.name}...`);
            // Convert pros and cons arrays to strings if they are arrays
            const carData = { ...car };
            if (Array.isArray(carData.pros)) {
                carData.pros = carData.pros.map(p => `• ${p}`).join('\n');
            }
            if (Array.isArray(carData.cons)) {
                carData.cons = carData.cons.map(c => `• ${c}`).join('\n');
            }

            const response = await fetch(`${API_BASE}/api/upcoming-cars`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLTE3NjE4MTcwODgyMTMiLCJlbWFpbCI6ImFkbWluQG1vdG9yb2N0YW5lLmNvbSIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImlhdCI6MTc2NDMwOTE0MCwiZXhwIjoxNzY0Mzk1NTQwfQ.1CtT-6Jk1ZWAV3nwe3aNluPvT3WK-nWDr17PUcxuaSc'
                },
                body: JSON.stringify(carData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create ${car.name}: ${errorText}`);
            }

            const data = await response.json();
            console.log(`✅ Created ${car.name} (ID: ${data.id})`);
        } catch (error) {
            console.error(`❌ Error creating ${car.name}:`, error.message);
        }
    }

    console.log('Finished creating upcoming cars.');
}

createUpcomingCars();
