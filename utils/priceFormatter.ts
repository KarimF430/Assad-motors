/**
 * Format price in Lakhs or Crores based on value
 * @param priceInLakhs - Price value in lakhs
 * @returns Formatted price string with appropriate unit
 */
export function formatPrice(priceInLakhs: number): string {
  if (priceInLakhs > 99.99) {
    // Convert to Crores
    const priceInCrores = priceInLakhs / 100
    return `₹ ${priceInCrores.toFixed(2)} Crore`
  } else {
    // Keep in Lakhs
    return `₹ ${priceInLakhs.toFixed(2)} Lakh`
  }
}

/**
 * Format price range in Lakhs or Crores
 * @param startPriceInLakhs - Starting price in lakhs
 * @param endPriceInLakhs - Ending price in lakhs
 * @returns Formatted price range string
 */
export function formatPriceRange(startPriceInLakhs: number, endPriceInLakhs: number): string {
  const bothInCrores = startPriceInLakhs > 99.99 && endPriceInLakhs > 99.99
  const bothInLakhs = startPriceInLakhs <= 99.99 && endPriceInLakhs <= 99.99
  
  if (bothInCrores) {
    // Both in Crores: "₹ 2.5 - 2.9 Crore"
    const startInCrores = (startPriceInLakhs / 100).toFixed(2)
    const endInCrores = (endPriceInLakhs / 100).toFixed(2)
    return `₹ ${startInCrores} - ${endInCrores} Crore`
  } else if (bothInLakhs) {
    // Both in Lakhs: "₹ 7.40 - 12.50 Lakh"
    return `₹ ${startPriceInLakhs.toFixed(2)} - ${endPriceInLakhs.toFixed(2)} Lakh`
  } else {
    // Different units: "₹ 7.40 Lakh - ₹ 2.50 Crore"
    return `${formatPrice(startPriceInLakhs)} - ${formatPrice(endPriceInLakhs)}`
  }
}
