/**
 * DEPRECIATION TYPES (Documentation)
 * Defines the standardized output structure for depreciation models.
 * 
 * @typedef {Object} DepreciationSummary
 * @property {string} vehicleId - UUID of the vehicle asset.
 * @property {string} method - Always "straight_line" currently.
 * @property {string} status - Result of calculation: "ok | insufficient_data | invalid_input".
 * @property {number} purchasePrice - Original capital investment.
 * @property {number} usefulLifeYears - Number of dividend periods.
 * @property {number} usefulLifeMonths - Total amortization duration.
 * @property {string} depreciationStartDate - Date depreciation began (ISO).
 * @property {string} asOfDate - Date calculation was run (ISO).
 * @property {number} elapsedMonths - Months since startDate.
 * @property {number} monthlyDepreciation - Amount of asset value lost per month.
 * @property {number} accumulatedDepreciation - Total value lost since purchase.
 * @property {number} currentValue - Asset's remaining residual valuation.
 * @property {number} totalExpensesToDate - Sum of fuel, maintenance, insurance, etc.
 * @property {number} tcoIncludingDepreciation - Total ownership cost (OPEX + CAPEX Loss).
 */

export const DEPRECIATION_METHODS = {
  STRAIGHT_LINE: 'straight_line',
  DECLINING_BALANCE: 'declining_balance' // for future extensibility
};

export const DEPRECIATION_STATUS = {
  OK: 'ok',
  INSUFFICIENT_DATA: 'insufficient_data',
  INVALID_INPUT: 'invalid_input'
};
