import { PricingData } from '@/types/estimator';

export const mockPricingData: PricingData = {
  roomTypes: [
    { id: 1, name: 'Kitchen', description: 'Kitchen area including cabinets' },
    { id: 2, name: 'Living Room', description: 'Main living area' },
    { id: 3, name: 'Dining Room', description: 'Formal dining area' },
    { id: 4, name: 'Bedroom', description: 'Standard bedroom' },
    { id: 5, name: 'Master Bedroom', description: 'Larger master bedroom' },
    { id: 6, name: 'Bathroom', description: 'Standard bathroom' },
    { id: 7, name: 'Master Bathroom', description: 'Larger master bathroom' },
    { id: 8, name: 'Hallway', description: 'Connecting hallway' },
    { id: 9, name: 'Office', description: 'Home office space' },
    { id: 10, name: 'Den/Family Room', description: 'Casual living space' }
  ],
  roomSizes: [
    { id: 1, name: 'Small', description: 'Up to 100 sq ft', base_price: 500 },
    { id: 2, name: 'Average', description: '100-150 sq ft', base_price: 650 },
    { id: 3, name: 'Large', description: '150-250 sq ft', base_price: 750 },
    { id: 4, name: 'XL', description: '250+ sq ft', base_price: 900 }
  ],
  paintTypes: [
    { id: 1, name: 'Standard', upcharge_percentage: 0, upcharge_amount: 0, description: 'Basic paint quality' },
    { id: 2, name: 'Premium', upcharge_percentage: 8, upcharge_amount: 20, description: 'Better durability and finish' },
    { id: 3, name: 'Duration', upcharge_percentage: 12, upcharge_amount: 25, description: 'High-end long-lasting finish' },
    { id: 4, name: 'Emerald', upcharge_percentage: 18, upcharge_amount: 35, description: 'Best quality and appearance' }
  ],
  roomAddons: [
    { id: 1, name: 'High Ceiling', cost: 600, description: 'Ceilings over 9 feet' },
    { id: 2, name: 'Paint Ceiling', cost: 0, cost_percentage: 40, description: 'Adding ceiling painting' },
    { id: 3, name: 'Two Colors', cost: 0, cost_percentage: 10, description: 'Using two different colors' },
    { id: 4, name: 'Millwork Priming', cost: 0, cost_percentage: 50, description: 'Priming millwork before painting' },
    { id: 5, name: 'Stair Railing', cost: 250, description: 'Painting stair railings' },
    { id: 6, name: 'Minimal Repairs', cost: 50, description: 'Small hole repairs and patching' },
    { id: 7, name: 'Standard Repairs', cost: 150, description: 'Average wall repairs' },
    { id: 8, name: 'Extensive Repairs', cost: 300, description: 'Major wall repairs needed' },
    { id: 9, name: 'Fireplace Mantel', cost: 100, description: 'Painting fireplace mantel' },
    { id: 10, name: 'Regular Closet', cost: 150, description: 'Per regular closet' },
    { id: 11, name: 'Walk-in Closet', cost: 300, description: 'Per walk-in closet' },
    { id: 12, name: 'Door', cost: 50, description: 'Per door (standard price)' },
    { id: 13, name: 'Window', cost: 35, description: 'Per window (standard price)' },
    { id: 14, name: 'Baseboard Installation', cost: 2, description: 'Per linear foot' }
  ],
  volumeDiscounts: [
    { id: 1, threshold: 2000, discount_percentage: 5, description: 'Projects over $2,000' },
    { id: 2, threshold: 3000, discount_percentage: 8, description: 'Projects over $3,000' },
    { id: 3, threshold: 5000, discount_percentage: 10, description: 'Projects over $5,000' },
    { id: 4, threshold: 10000, discount_percentage: 15, description: 'Projects over $10,000' }
  ]
};

export const mockProjects = [
  { id: 1, name: 'Kitchen Renovation' },
  { id: 2, name: 'Full House Repaint' },
  { id: 3, name: 'Master Bedroom Update' },
  { id: 4, name: 'Create New Project', isCreateNew: true }
];

export const mockBaseboardTypes = [
  { id: 1, name: 'Regular Baseboards', upcharge_percentage: 0 },
  { id: 2, name: 'Brushed Baseboards', upcharge_percentage: 25 },
  { id: 3, name: 'Custom Baseboards', upcharge_percentage: 40 }
];

export const mockRepairOptions = [
  { id: 1, name: 'No Repairs', cost: 0 },
  { id: 2, name: 'Minimal Repairs', cost: 50 },
  { id: 3, name: 'Standard Repairs', cost: 150 },
  { id: 4, name: 'Extensive Repairs', cost: 300 }
];

export const mockFireplaceOptions = [
  { id: 1, name: 'None', cost: 0 },
  { id: 2, name: 'Standard', cost: 75 },
  { id: 3, name: 'Brushed', cost: 100 },
  { id: 4, name: 'Custom Design', cost: 150 }
];

export const mockPaintMethods = [
  { id: 1, name: 'Spray', cost_multiplier: 1.0 },
  { id: 2, name: 'Roll', cost_multiplier: 1.2 },
  { id: 3, name: 'Brush', cost_multiplier: 1.5 }
];

export const fetchPricingData = (): Promise<PricingData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPricingData);
    }, 500);
  });
};
