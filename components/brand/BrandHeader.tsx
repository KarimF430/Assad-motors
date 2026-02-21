'use client'

interface BrandHeaderProps {
  brand: string
}

export default function BrandHeader({ brand }: BrandHeaderProps) {
  if (!brand) {
    return (
      <section className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900">Brand Not Found</h1>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {brand.charAt(0).toUpperCase() + brand.slice(1)} Cars
        </h1>
      </div>
    </section>
  )
}
