
// Mock repair options (these should eventually come from Supabase too)
export const mockRepairOptions = [
  { id: 1, name: 'No Repairs', cost: 0 },
  { id: 2, name: 'Minor Repairs', cost: 250 },
  { id: 3, name: 'Major Repairs', cost: 750 }
];

// Updated fireplace options as requested
export const mockFireplaceOptions = [
  { id: 1, name: 'None', cost: 0 },
  { id: 2, name: 'Brush Mantel', cost: 100 },
  { id: 3, name: 'Spray Mantel', cost: 225 }
];

export const mockPaintMethods = [
  { id: 1, name: 'Spray' },
  { id: 2, name: 'Brush' },
  { id: 3, name: 'Roll' }
];
