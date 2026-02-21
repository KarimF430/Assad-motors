// Utility functions for displaying prices across the site

/**
 * Format price in Indian number format
 */
export function formatIndianPrice(price: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(price))
}

/**
 * Format price in Lakh format (e.g., "12.39 Lakh")
 */
export function formatLakhPrice(price: number): string {
  const lakh = price / 100000
  return `${lakh.toFixed(2)} Lakh`
}

/**
 * Format price with label (Ex-Showroom or On-Road)
 */
export function formatPriceWithLabel(
  price: number,
  isOnRoad: boolean,
  format: 'indian' | 'lakh' = 'indian'
): { label: string; price: string } {
  const label = isOnRoad ? 'On-Road' : 'Ex-Showroom'
  const formattedPrice = format === 'lakh' 
    ? formatLakhPrice(price)
    : `₹ ${formatIndianPrice(price)}`
  
  return { label, price: formattedPrice }
}

/**
 * Get starting price text (for model cards)
 */
export function getStartingPriceText(
  price: number,
  isOnRoad: boolean
): string {
  const label = isOnRoad ? 'Price' : 'Ex-Showroom Price'
  return `${label} ₹ ${formatLakhPrice(price)}`
}
