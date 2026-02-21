/**
 * Truncates text to a specified length and adds ellipsis if needed
 * @param text - The text to truncate
 * @param maxLength - Maximum number of characters (default: 18)
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 18): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Truncates car name (brand + model) to fit in card layouts
 * @param brand - Car brand name
 * @param model - Car model name
 * @param maxLength - Maximum number of characters (default: 18)
 * @returns Truncated car name with ellipsis if needed
 */
export function truncateCarName(brand: string, model: string, maxLength: number = 18): string {
  const fullName = `${brand} ${model}`;
  return truncateText(fullName, maxLength);
}
