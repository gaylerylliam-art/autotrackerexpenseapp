/**
 * AUTO-TRACK DEPRECIATION ENGINE (MVP: Straight-Line)
 * Core financial engine for calculating vehicle asset valuation over time.
 */

/**
 * Calculates straight-line monthly depreciation.
 * @param {number} purchasePrice - Initial cost of the vehicle.
 * @param {number} usefulLifeYears - Number of years the vehicle is expected to be useful.
 * @returns {number} Monthly depreciation amount.
 */
export const calculateMonthlyDepreciation = (purchasePrice, usefulLifeYears = 10) => {
  if (!purchasePrice || purchasePrice <= 0) return 0;
  const usefulLifeMonths = usefulLifeYears * 12;
  return purchasePrice / usefulLifeMonths;
};

/**
 * Calculates number of full months between two dates.
 * @param {Date} startDate - Date when depreciation starts.
 * @param {Date} endDate - Current or reference date.
 * @returns {number} Total elapsed months.
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
 * Calculates total accumulated depreciation to date.
 * @param {number} monthlyDepreciation - Amount the vehicle depreciates each month.
 * @param {number} elapsedMonths - Number of months since purchase/start.
 * @param {number} purchasePrice - Total purchase price (cap).
 * @returns {number} Total depreciation amount.
 */
export const calculateAccumulatedDepreciation = (monthlyDepreciation, elapsedMonths, purchasePrice) => {
  const total = monthlyDepreciation * elapsedMonths;
  return Math.min(total, purchasePrice);
};

/**
 * Calculates the current residual value of the asset.
 * @param {number} purchasePrice - Original purchase price.
 * @param {number} accumulatedDepreciation - Depreciation to date.
 * @returns {number} Residual value (min 0).
 */
export const calculateCurrentValue = (purchasePrice, accumulatedDepreciation) => {
  return Math.max(purchasePrice - accumulatedDepreciation, 0);
};

/**
 * Builds a complete vehicle depreciation summary object.
 * @param {Object} vehicle - Vehicle data from database.
 * @param {number} totalExpenses - Total operational expenses for the vehicle.
 * @returns {Object} Normalized depreciation summary.
 */
export const buildVehicleDepreciationSummary = (vehicle, totalExpenses = 0) => {
  const { 
    id: vehicleId, 
    purchase_price, 
    purchase_date, 
    registration_date, 
    useful_life_years = 10,
    depreciation_method = 'straight_line'
  } = vehicle;

  const purchasePrice = parseFloat(purchase_price);
  const startDate = purchase_date || registration_date;
  
  // EDGE CASE: Missing required numerical data
  if (!purchasePrice || isNaN(purchasePrice)) {
    return { vehicleId, status: 'insufficient_data', method: depreciation_method, error: 'missing_purchase_price' };
  }

  // EDGE CASE: Missing dates
  if (!startDate) {
    return { vehicleId, status: 'insufficient_data', method: depreciation_method, error: 'missing_dates' };
  }

  const asOfDate = new Date();
  const usefulLifeMonths = useful_life_years * 12;
  const monthlyDepreciation = calculateMonthlyDepreciation(purchasePrice, useful_life_years);
  const elapsedMonths = getElapsedMonths(startDate, asOfDate);
  const accumulatedDepreciation = calculateAccumulatedDepreciation(monthlyDepreciation, elapsedMonths, purchasePrice);
  const currentValue = calculateCurrentValue(purchasePrice, accumulatedDepreciation);
  const tcoIncludingDepreciation = totalExpenses + accumulatedDepreciation;

  return {
    vehicleId,
    method: depreciation_method,
    status: 'ok',
    purchasePrice,
    usefulLifeYears: useful_life_years,
    usefulLifeMonths,
    depreciationStartDate: startDate,
    asOfDate: asOfDate.toISOString(),
    elapsedMonths,
    monthlyDepreciation,
    accumulatedDepreciation,
    currentValue,
    totalExpensesToDate: totalExpenses,
    tcoIncludingDepreciation
  };
};
