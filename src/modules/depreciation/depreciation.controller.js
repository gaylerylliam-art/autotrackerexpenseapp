import { supabase } from '../../utils/supabase'
import * as service from './depreciation.service'

/**
 * DEPRECIATION CONTROLLER
 * Facade for accessing depreciation insights throughout the AutoTrack application.
 */

/**
 * Hook or utility used in Vehicle Details screens. 
 */
export const getBriefing = async (vehicleId) => {
  return await service.getVehicleDepreciationSummary(vehicleId);
};

/**
 * Fleet analysis used in Dashboard KPIs and Reports.
 * Fetches all vehicles then returns aggregation.
 */
export const getFleetBriefing = async () => {
  const { data: vehicles } = await supabase.from('vehicles').select('*');
  const { data: expenses } = await supabase.from('expenses').select('vehicle_id, amount');

  // Group expenses by vehicle
  const expenseMap = (expenses || []).reduce((acc, curr) => {
    acc[curr.vehicle_id] = (acc[curr.vehicle_id] || 0) + parseFloat(curr.amount || 0);
    return acc;
  }, {});

  const vehiclesWithExpenses = (vehicles || []).map(v => ({
    ...v,
    total_expenses: expenseMap[v.id] || 0
  }));

  return service.calculateFleetDepreciationSummary(vehiclesWithExpenses);
};
