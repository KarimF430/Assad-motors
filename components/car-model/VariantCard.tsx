import { formatPrice } from '@/utils/priceFormatter'

interface VariantCardProps {
  variant: {
    id: string
    name: string
    price: number
    fuel: string
    transmission: string
    power: string
    features: string
  }
  onClick: () => void
  onGetPrice: (e: React.MouseEvent) => void
  onCompare: (e: React.MouseEvent) => void
}

export default function VariantCard({ variant, onClick, onGetPrice, onCompare }: VariantCardProps) {
  const displayPrice = variant.price
  const priceLabel = 'Price'

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0 pr-4">
          <h4 className="text-lg font-bold text-red-600 mb-1 truncate" title={variant.name}>{variant.name}</h4>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{variant.fuel}</span>
            <span>{variant.transmission}</span>
            <span>{variant.power.split('@')[0].trim()}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{priceLabel}</p>
          <p className="text-xl font-bold text-gray-900">{formatPrice(displayPrice)}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-900 mb-2">Key Features:</p>
        <p className="text-sm text-gray-600 line-clamp-2 overflow-hidden">
          {variant.features}
        </p>
      </div>

      <div className="flex space-x-3">
        <button
          className="bg-[#291e6a] hover:bg-[#1c144a] text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          onClick={onGetPrice}
        >
          Get On-Road Price
        </button>
        <button
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors"
          onClick={onCompare}
        >
          Compare
        </button>
      </div>
    </div>
  )
}
