const fs = require('fs');

const carModelPath = 'components/car-model/CarModelPage.tsx';
let carModelLines = fs.readFileSync(carModelPath, 'utf8').split('\n');

// 1. Get Similar Cars code from VariantPage.tsx
const varPage = fs.readFileSync('components/variant/VariantPage.tsx', 'utf8').split('\n');
const similarCardsStartIdx = varPage.findIndex(l => l.includes('{/* Similar Cars Section - Same as Model Page */}'));
// We want to extract up to the end of the div containing it. Actually better to use grep to find exact section bounds
// Let's copy it manually from my context.

let sectionsToInsert = `

        {/* Section 4: Similar Cars You Might Like */}
        {
          (model?.similarCars && model.similarCars.length > 0) ? (
            <PageSection background="white" maxWidth="7xl">
              <div id="similar-cars" className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
                    Similar Cars You Might Like
                  </h2>
                  <div className="relative group">
                    <button
                      onClick={() => {
                        const container = document.getElementById('model-similar-scroll')
                        container?.scrollBy({ left: -300, behavior: 'smooth' })
                      }}
                      className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
                      aria-label="Scroll left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        const container = document.getElementById('model-similar-scroll')
                        container?.scrollBy({ left: 300, behavior: 'smooth' })
                      }}
                      className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full items-center justify-center text-gray-700 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
                      aria-label="Scroll right"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div
                      id="model-similar-scroll"
                      className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {model.similarCars.filter((car: any) => (car.startingPrice || 0) > 100000).map((car: any) => {
                        const transformedCar = {
                          id: car.id,
                          name: car.name,
                          brand: car.brand || car.brandName,
                          brandName: car.brandName,
                          image: car.image || '/placeholder-car.png',
                          startingPrice: car.startingPrice,
                          lowestPriceFuelType: car.fuelTypes?.[0] || 'Petrol',
                          fuelTypes: car.fuelTypes || ['Petrol'],
                          transmissions: car.transmissionTypes || ['Manual'],
                          seating: car.seating || 5,
                          launchDate: car.launchDate || 'Recently Launched',
                          slug: car.slug || (car.brandName?.toLowerCase().replace(/\s+/g, '-') + '-' + car.name?.toLowerCase().replace(/\s+/g, '-')),
                          isNew: car.isNew || false,
                          isPopular: car.isPopular || false
                        }

                        return (
                          <CarCard
                            key={car.id}
                            car={transformedCar}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </PageSection>
          ) : null
        }

        {/* Section 5: FAQ & Reviews */}
        <PageSection background="white" maxWidth="7xl">
          <div className="space-y-12">
            <div id="faq" className="scroll-mt-24">
              <ModelFAQ 
                brandName={model?.brand || ''} 
                modelName={model?.name || ''} 
                faqs={model?.faqs || []} 
              />
            </div>
          </div>
        </PageSection>
`;

// Find where Key Features ends.
// We can locate {/* Section 4: AD Banner */} or whatever is right after Key Features.
const adBannerStartIdx = carModelLines.findIndex(l => l.includes('{/* Section 11: AD Banner */}'));
if (adBannerStartIdx !== -1) {
    carModelLines.splice(adBannerStartIdx, 0, sectionsToInsert);
    fs.writeFileSync(carModelPath, carModelLines.join('\n'));
    console.log('Successfully inserted Similar Cars and FAQ before AD Banner');
} else {
    // maybe 11 isn't there. let's find Section 4 or end of it.
    console.log('Fallback searching...');
    const index = carModelLines.findIndex(l => l.includes('<Ad3DCarousel'));
     if(index !== -1){
        carModelLines.splice(index - 2, 0, sectionsToInsert);
        fs.writeFileSync(carModelPath, carModelLines.join('\n'));
        console.log('Successfully inserted by looking for Ad3DCarousel');
     } else {
        console.log('Could not find insertion point.');
     }
}
