'use client'

interface SEOTextProps {
  brand: string
}

export default function SEOText({ brand }: SEOTextProps) {
  // Mock brand data with safe fallbacks
  const brandData: Record<string, { description: string; models: string[] }> = {
    maruti: {
      description: "Leading automotive manufacturer with a comprehensive range of vehicles across multiple categories.",
      models: ["Swift", "Baleno", "Dzire", "Vitara Brezza", "Ertiga", "Alto", "WagonR", "Celerio"]
    },
    hyundai: {
      description: "Premium automotive brand offering innovative technology and stylish design across various segments.",
      models: ["Creta", "Venue", "Exter", "i20", "Verna", "Alcazar", "Tucson", "Kona Electric"]
    },
    tata: {
      description: "Trusted Indian automotive manufacturer known for safety, innovation and sustainable mobility solutions.",
      models: ["Nexon", "Harrier", "Safari", "Tiago", "Tigor", "Punch", "Altroz", "Curvv"]
    }
  }

  const currentBrand = brandData[brand.toLowerCase()] || {
    description: "Automotive manufacturer offering quality vehicles.",
    models: []
  }

  return (
    <section className="bg-white py-4">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          {currentBrand.description}
          <span className="text-blue-600 cursor-pointer ml-1">...more</span>
        </p>
      </div>
    </section>
  )
}
