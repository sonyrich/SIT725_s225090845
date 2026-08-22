// test/priceUtils.test.js
// Unit tests for the calculation function (calculateDiscountedPrice).
// Adjust the require path below to match where you placed priceUtils.js
// e.g. '../utils/priceUtils' or '../services/books.service'

const { expect } = require('chai');
const { calculateDiscountedPrice } = require('../utils/priceUtils');

describe('calculateDiscountedPrice (calculation function)', () => {

  it('VALID: returns the correct price for a normal 10% discount', () => {
    const result = calculateDiscountedPrice(100, 10);
    expect(result).to.equal(90);
  });

  it('INVALID: throws an error when price is not a number', () => {
    expect(() => calculateDiscountedPrice('one hundred', 10)).to.throw('Price must be a number');
  });

  it('INVALID: throws an error when discountPercent is out of range (>100)', () => {
    expect(() => calculateDiscountedPrice(100, 150)).to.throw('Discount percent must be between 0 and 100');
  });

  it('EDGE CASE: a 0% discount returns the original price unchanged', () => {
    const result = calculateDiscountedPrice(49.99, 0);
    expect(result).to.equal(49.99);
  });

  it('EDGE CASE: a 100% discount returns 0', () => {
    const result = calculateDiscountedPrice(75, 100);
    expect(result).to.equal(0);
  });

});
