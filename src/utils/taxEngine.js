/**
 * AutoTracker Tax & Reimbursement Engine
 * Supports UAE, USA, UK, and Custom logic
 */

export const COUNTRY_RATES = {
  UAE: {
    countryName: 'United Arab Emirates',
    currency: 'AED',
    ratePerKm: 2.14, // Common reimbursement rate
    vatRate: 0.05,
    corporateTaxRate: 0.09, // UAE Corporate Tax
    labels: {
      vat: 'VAT (5%)',
      tax: 'Corp Tax',
      reimbursement: 'Reimbursement'
    }
  },
  USA: {
    countryName: 'United States',
    currency: 'USD',
    ratePerMile: 0.67, // IRS 2024 standard
    vatRate: 0, 
    corporateTaxRate: 0.21,
    labels: {
      vat: 'Sales Tax',
      tax: 'Income Tax',
      reimbursement: 'IRS Deduction'
    }
  },
  UK: {
    countryName: 'United Kingdom',
    currency: 'GBP',
    ratePerMile: 0.45, 
    vatRate: 0.20,
    corporateTaxRate: 0.25,
    labels: {
      vat: 'VAT (20%)',
      tax: 'Corp Tax',
      reimbursement: 'Approved Mileage'
    }
  }
};

export const calculateReimbursement = (distance, rate) => (distance || 0) * (rate || 0);

export const calculateTaxBenefit = (expenses, businessUsagePercent) => {
  return (expenses || 0) * ((businessUsagePercent || 0) / 100);
};

export const getTaxProfile = (country = 'UAE', customRate = null) => {
  const profile = COUNTRY_RATES[country] || COUNTRY_RATES.UAE;
  const finalProfile = { ...profile };
  if (customRate) {
    if (country === 'USA' || country === 'UK') {
      finalProfile.ratePerMile = customRate;
    } else {
      finalProfile.ratePerKm = customRate;
    }
  }
  return finalProfile;
};

export const formatCurrency = (amount, currency = 'AED') => {
  return new Intl.NumberFormat(currency === 'AED' ? 'en-AE' : 'en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount || 0);
};
