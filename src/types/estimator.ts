
// Common types for the Paint Pro estimator

export type RoomType = {
  id: string; // Changed from number to string to match UUID from Supabase
  name: string;
  description?: string;
  created_at?: string;
};

export type RoomSize = {
  id: string; // Changed from number to string to match UUID from Supabase
  name: string;
  description?: string;
  base_price: number;
  created_at?: string;
};

export type PaintType = {
  id: string; // Changed from number to string to match UUID from Supabase
  name: string;
  upcharge_percentage: number;
  upcharge_amount: number;
  description?: string;
  created_at?: string;
};

export type RoomAddOn = {
  id: string; // Changed from number to string to match UUID from Supabase
  name: string;
  cost: number;
  cost_percentage?: number;
  description?: string;
  category?: string;
  created_at?: string;
};

export type VolumeDiscount = {
  id: string; // Changed from number to string to match UUID from Supabase
  threshold: number;
  discount_percentage: number;
  description?: string;
  created_at?: string;
};

export type SpecialCondition = {
  id: string; // Changed from number to string to match UUID from Supabase
  name: string;
  discount_percentage: number;
  description?: string;
  created_at?: string;
};

export type Extra = {
  id: string; // Changed from number to string to match UUID from Supabase
  name: string;
  price: number;
  price_unit?: string;
  description?: string;
  category?: string;
  created_at?: string;
};

export type PaintMethod = 'Spray' | 'Brush' | 'Roll';

export interface RoomDetail {
  id: string;
  name: string;
  roomType: RoomType;
  size: RoomSize;
  paintType: PaintType;
  baseboardType: string;
  options: {
    emptyRoom: boolean;
    noFloorCovering: boolean;
    twoColors: boolean;
    millworkPriming: boolean;
    highCeiling: boolean;
    paintCeiling: boolean;
    stairRailing: boolean;
  };
  doors: {
    count: number;
    paintMethod: PaintMethod;
  };
  windows: {
    count: number;
    paintMethod: PaintMethod;
  };
  closets: {
    walkInCount: number;
    regularCount: number;
  };
  fireplace: string;
  repairs: string;
  baseboardInstallationFeet: number;
  price: number;
  priceDetails: {
    [key: string]: number;
  };
}

export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  projectName: string;
}

export interface EstimatorSummary {
  subtotal: number;
  volumeDiscount: number;
  total: number;
  rooms: RoomDetail[];
  contactInfo: ContactInfo;
}

export type PricingData = {
  roomTypes: RoomType[];
  roomSizes: RoomSize[];
  paintTypes: PaintType[];
  roomAddons: RoomAddOn[];
  volumeDiscounts: VolumeDiscount[];
  specialConditions?: SpecialCondition[];
  extras?: Extra[];
};
