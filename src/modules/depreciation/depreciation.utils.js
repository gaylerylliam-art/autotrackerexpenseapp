/**
 * DEPRECIATION UTILS (Straight-Line Calculation)
 * Implements core mathematical formulas defined in AutoTrack Financial Specs.
 */

/**
 * Monthly Depreciation = Purchase Price / Useful Life (months)
 */
export const calculateMonthlyDepreciation = (purchasePrice, usefulLifeYears = 10) => {
  if (!purchasePrice || purchasePrice <= 0) return 0;
  const usefulLifeMonths = usefulLifeYears * 12;
  return purchasePrice / usefulLifeMonths;
};

/**
 * Returns formatted months since purchase.
 */
export const getElapsedMonths = (startDate, endDate = new Date()) => {
  if (!startDate || startDate > endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  
  return (years * 12) + months;
};

/**
 * Accumulated Depreciation = monthly_depreciation × elapsed_months (capped)
 */
export const calculateAccumulatedDepreciation = (monthlyDepreciation, elapsedMonths, purchasePrice) => {
  const total = monthlyDepreciation * elapsedMonths;
  return Math.min(total, purchasePrice);
};

/**
 * Current Value = purchase_price − accumulated_depreciation (min 0)
 */
export const calculateCurrentValue = (purchasePrice, accumulatedDepreciation) => {
  return Math.max(purchasePrice - accumulatedDepreciation, 0);
};
