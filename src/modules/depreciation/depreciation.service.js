import { supabase } from '../../utils/supabase'
import * as utils from './depreciation.utils'

/**
 * DEPRECIATION SERVICE
 * Core service for fetching vehicle-related financial data and computing 
 * the depreciation summary according to AutoTrack specifications.
 */

/**
 * Fetches and builds a complete depreciation summary for a single vehicle.
 * GET /vehicles/:id/depreciation
 * 
 * @param {string} vehicleId - Database UUID for the vehicle.
 * @returns {Promise<Object>} Normalized summary object.
 */
export const getVehicleDepreciationSummary = async (vehicleId, asOfDate = new Date()) => {
  try {
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();

    if (error) throw error;
    if (!vehicle) return { vehicleId, status: 'not_found' };

    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount')
      .eq('vehicle_id', vehicleId);

    const totalExpenses = (expenses || []).reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

    return buildVehicleSummary(vehicle, totalExpenses, asOfDate);
  } catch (err) {
    console.error(`[Depreciation Service] Error: ${err.message}`);
    return { vehicleId, status: 'error', message: err.message };
  }
};

/**
 * Normalizes a vehicle record into a depreciation summary.
 */
export const buildVehicleSummary = (vehicle, totalExpenses = 0, asOfDate = new Date()) => {
  const { 
    purchase_price, 
    purchase_date, 
    registration_date, 
    useful_life_years = 10,
    depreciation_method = 'straight_line'
  } = vehicle;

  const purchasePrice = parseFloat(purchase_price);
  const startDateStr = purchase_date || registration_date;
  
  if (!purchasePrice || purchasePrice <= 0 || isNaN(purchasePrice)) {
    return { vehicleId: vehicle.id, status: 'insufficient_data', method: depreciation_method, error: 'missing_purchase_price' };
  }

  if (!startDateStr) {
    return { vehicleId: vehicle.id, status: 'insufficient_data', method: depreciation_method, error: 'missing_dates' };
  }

  const startDate = new Date(startDateStr);
  if (startDate > asOfDate) {
    return { vehicleId: vehicle.id, status: 'invalid_input', error: 'future_purchase_date' };
  }

  const usefulLifeMonths = useful_life_years * 12;
  const monthlyDepreciation = utils.calculateMonthlyDepreciation(purchasePrice, useful_life_years);
  const elapsedMonths = utils.getElapsedMonths(startDate, asOfDate);
  const accumulatedDepreciation = utils.calculateAccumulatedDepreciation(monthlyDepreciation, elapsedMonths, purchasePrice);
  const currentValue = utils.calculateCurrentValue(purchasePrice, accumulatedDepreciation);
  const tcoIncludingDepreciation = totalExpenses + accumulatedDepreciation;

  const summary = {
    vehicleId: vehicle.id,
    method: 'straight_line',
    status: 'ok',
    purchasePrice,
    usefulLifeYears: useful_life_years,
    usefulLifeMonths,
    depreciationStartDate: startDateStr,
    asOfDate: asOfDate.toISOString(),
    elapsedMonths,
    monthlyDepreciation,
    accumulatedDepreciation,
    currentValue,
    totalExpensesToDate: totalExpenses,
    tcoIncludingDepreciation
  };

  return {
    ...summary,
    make: vehicle.make,
    model: vehicle.model,
    plate: vehicle.plate,
    year: vehicle.year,
    image_url: vehicle.image_url,
    health: vehicle.health
  };
};

/**
 * Aggregate summary for an entire fleet or group of vehicles.
 * 
 * @param {Array} vehiclesArray - List of vehicle objects with their total expenses.
 * @returns {Object} Total fleet summary.
 */
export const calculateFleetDepreciationSummary = (vehiclesArray) => {
  const summaries = vehiclesArray.map(v => buildVehicleSummary(v, v.total_expenses || 0));
  
  const validSummaries = summaries.filter(s => s.status === 'ok');

  return {
    totalFleetAssetValue: validSummaries.reduce((acc, s) => acc + s.currentValue, 0),
    totalFleetMonthlyDepreciation: validSummaries.reduce((acc, s) => acc + s.monthlyDepreciation, 0),
    totalFleetAccumulatedDepreciation: validSummaries.reduce((acc, s) => acc + s.accumulatedDepreciation, 0),
    fleetWideTCO: validSummaries.reduce((acc, s) => acc + s.tcoIncludingDepreciation, 0),
    assetCount: validSummaries.length,
    insufficientDataCount: summaries.length - validSummaries.length,
    highLossVehicles: validSummaries
      .sort((a, b) => b.monthlyDepreciation - a.monthlyDepreciation)
      .slice(0, 5)
  };
};
