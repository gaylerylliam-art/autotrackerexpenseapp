/**
 * AutoTrack — Core Financial & Depreciation Engine
 * Implements straight-line depreciation as per business requirements.
 */

export const DEFAULT_USEFUL_LIFE_YEARS = 10;

/**
 * Calculates current valuation metrics for a vehicle.
 * 
 * @param {Object} vehicle - The vehicle object from database
 * @param {number} vehicle.purchase_price - Original price
 * @param {string} vehicle.registration_date - ISO date or Date object
 * @param {number} [vehicle.useful_life_years] - Optional override (default 10)
 * @returns {Object} - Depreciation metrics
 */
export function calculateDepreciation(vehicle) {
  const price = parseFloat(vehicle.purchase_price) || 0;
  const usefulLifeYears = parseInt(vehicle.useful_life_years) || DEFAULT_USEFUL_LIFE_YEARS;
  const usefulLifeMonths = usefulLifeYears * 12;

  // Monthly depreciation rate
  const monthlyDepreciation = price > 0 ? price / usefulLifeMonths : 0;

  // Calculate elapsed months since registration
  const registrationDate = new Date(vehicle.registration_date || vehicle.created_at || new Date());
  const now = new Date();
  
  const elapsedMonths = (now.getFullYear() - registrationDate.getFullYear()) * 12 + (now.getMonth() - registrationDate.getMonth());
  const validElapsedMonths = Math.max(0, elapsedMonths);

  // Accumulated depreciation
  const accumulatedDepreciation = Math.min(price, monthlyDepreciation * validElapsedMonths);

  // Asset Value
  const currentValue = Math.max(0, price - accumulatedDepreciation);

  return {
    monthlyDepreciation,
    accumulatedDepreciation,
    currentValue,
    elapsedMonths: validElapsedMonths,
    usefulLifeMonths,
    retainedEquityPercentage: price > 0 ? (currentValue / price) * 100 : 0
  };
}

/**
 * Calculates Total Cost of Ownership (TCO) including depreciation.
 * 
 * @param {Array} expenses - List of all expenses for the vehicle
 * @param {Object} depreciationMetrics - Output from calculateDepreciation
 */
export function calculateTCO(expenses = [], depreciationMetrics) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
  return {
    totalExpenses,
    totalDepreciation: depreciationMetrics.accumulatedDepreciation,
    tco: totalExpenses + depreciationMetrics.accumulatedDepreciation
  };
}
