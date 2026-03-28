-- Migration: Add Depreciation fields to Vehicles table
-- Adds purchase_price, purchase_date, and useful_life_years (default 10) to the vehicles table.
-- Ensures that the depreciation_method defaults to 'straight_line'.

ALTER TABLE public.vehicles 
  ADD COLUMN IF NOT EXISTS purchase_price NUMERIC(15, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS purchase_date DATE,
  ADD COLUMN IF NOT EXISTS useful_life_years INT DEFAULT 10,
  ADD COLUMN IF NOT EXISTS depreciation_method TEXT DEFAULT 'straight_line',
  ADD COLUMN IF NOT EXISTS depreciation_enabled BOOLEAN DEFAULT TRUE;

-- Recommended: Ensure default values for existing rows
UPDATE public.vehicles SET 
  purchase_price = 0,
  useful_life_years = 10,
  depreciation_method = 'straight_line',
  depreciation_enabled = TRUE
WHERE purchase_price IS NULL;

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_vehicles_dep_method ON public.vehicles(depreciation_method);
