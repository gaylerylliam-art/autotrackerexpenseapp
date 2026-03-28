import * as utils from './depreciation.utils.js'

/**
 * AUTO-TRACK DEPRECIATION ENGINE: TEST SUITE (MVP)
 * To be run with 'node src/modules/depreciation/depreciation.test.js'
 */

const assert = (condition, message) => {
  if (!condition) {
    console.error(`🔴 FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`🟢 PASS: ${message}`);
  }
};

console.log("------- DEPRECIATION UNIT TESTS (AUTO-TRACK) -------");

// Test 1: Straight-Line Formula
// Purchase 120,000, 10 Years -> 1,000 Monthly
const monthly = utils.calculateMonthlyDepreciation(120000, 10);
assert(monthly === 1000, "120,000 / 120 months = 1,000 monthly");

// Test 2: Elapsed Months
// Jan 1 2024 to March 1 2024 -> 2 months
const startDate = new Date('2024-01-01');
const referenceDate = new Date('2024-03-01');
const elapsed = utils.getElapsedMonths(startDate, referenceDate);
assert(elapsed === 2, "Jan 1 to March 1 = 2 months");

// Test 3: Accumulated Depreciation
// 1000 Monthly for 24 Months
const accumulated = utils.calculateAccumulatedDepreciation(1000, 24, 120000);
assert(accumulated === 24000, "1,000 * 24 = 24,000 accumulated");

// Test 4: Maximum Capping
// 1000 Monthly for 150 Months on 120k Original Price
const capped = utils.calculateAccumulatedDepreciation(1000, 150, 120000);
assert(capped === 120000, "Accumulated must not exceed purchase price (120,000)");

// Test 5: Current Residual Value
// 120,000 Price - 24,000 Accumulated = 96,000
const residual = utils.calculateCurrentValue(120000, 24000);
assert(residual === 96000, "Current Value is original minus accumulated (96,000)");

// Test 6: Zero Floor
const floor = utils.calculateCurrentValue(120000, 130000);
assert(floor === 0, "Current value must not go below 0");

console.log("-----------------------------------------------------");
console.log("ALL CORE DEPRECIATION CALCULATIONS PASS (6/6)");
console.log("-----------------------------------------------------");
