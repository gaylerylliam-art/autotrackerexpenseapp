const expenseCategories = [
  {
    category: 'Fuel',
    label: 'Fuel & Energy',
    icon: 'Fuel',
    color: 'blue',
    subcategories: ['Petrol (Super 98)', 'Petrol (Special 95)', 'Diesel', 'EV Charging', 'Fuel Tax Control']
  },
  {
    category: 'Service',
    label: 'Service & Maintenance',
    icon: 'Wrench',
    color: 'emerald',
    subcategories: ['Major Service', 'Minor Service', 'Oil & Filter', 'Tire Replacement', 'Brake System', 'Battery Replacement']
  },
  {
    category: 'Repair',
    label: 'Mechanical Repairs',
    icon: 'Activity',
    color: 'indigo',
    subcategories: ['Engine Repair', 'Transmission', 'Suspension', 'AC System', 'Electrical', 'Body Work']
  },
  {
    category: 'Fire, Safety & IT',
    label: 'Fire, Safety & IT',
    icon: 'ShieldCheck',
    color: 'orange',
    subcategories: [
      'Fire Extinguisher Recertification',
      'Safety Kit Replenishment',
      'CCTV Camera Maintenance',
      'GPS Tracker Subscription',
      'Fleet Management Software',
      'Dashcam Infrastructure',
      'Wireless Connectivity (SIM/4G)',
      'Digital Display Maintenance',
      'Cybersecurity Monitoring',
      'IT Cloud Infrastructure Fees',
      'Telematics Hardware Repair',
      'Safety Signage & Decals',
      'Emergency Lighting Maintenance',
      'Driver Safety Analytics',
      'ID Card System/Scanning'
    ]
  },
  {
    category: 'Insurance',
    label: 'Insurance & Protection',
    icon: 'Shield',
    color: 'red',
    subcategories: ['Comprehensive Policy', 'Third Party Liability', 'Gap Insurance', 'Roadside Assistance', 'Policy Endorsement']
  },
  {
    category: 'Compliance',
    label: 'Compliance & Registration',
    icon: 'FileText',
    color: 'purple',
    subcategories: ['Registration Renewal (Mulkiya)', 'Environmental Impact Fee', 'Inspection (Passing)', 'Number Plate Replacement', 'VCC Certificate']
  },
  {
    category: 'Tolls/Parking',
    label: 'Tolls & Parking',
    icon: 'Navigation',
    color: 'amber',
    subcategories: ['Salik Recharge', 'Mawaqif/Darbi', 'Public Parking', 'Valet Fees', 'Corporate Toll Accrual']
  },
  {
    category: 'Fines',
    label: 'Fines & Violations',
    icon: 'AlertCircle',
    color: 'rose',
    subcategories: ['Speeding Fine', 'Parking Violation', 'Salik Fine', 'Lane Violation', 'Late Registration Fine']
  },
  {
    category: 'Other',
    label: 'Other Operational',
    icon: 'Plus',
    color: 'slate',
    subcategories: ['Car Wash', 'Sanitization', 'Accessories', 'Export Fees', 'Miscellaneous']
  }
];

export default expenseCategories;
