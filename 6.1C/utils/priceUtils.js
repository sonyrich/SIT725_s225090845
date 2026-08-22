// utils/priceUtils.js
/**
 * Calculates the discounted price of a book (or any priced item).
 * @param {number} price - original price, must be a non-negative number
 * @param {number} discountPercent - discount percentage, must be between 0 and 100
 * @returns {number} the discounted price, rounded to 2 decimal places
 * @throws {Error} if price/discountPercent are not numbers, or discountPercent is out of range
 */
function calculateDiscountedPrice(price, discountPercent) {
  if (typeof price !== 'number' || Number.isNaN(price)) {
    throw new Error('Price must be a number');
  }
  if (typeof discountPercent !== 'number' || Number.isNaN(discountPercent)) {
    throw new Error('Discount percent must be a number');
  }
  if (price < 0) {
    throw new Error('Price cannot be negative');
  }
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount percent must be between 0 and 100');
  }

  const discounted = price - (price * discountPercent) / 100;
  return Math.round(discounted * 100) / 100;
}

module.exports = { calculateDiscountedPrice };
