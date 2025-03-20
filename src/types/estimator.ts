
// Common types for the Paint Pro estimator

export type RoomType = {
  id: number;
  name: string;
  description?: string;
};

export type RoomSize = {
  id: number;
  name: string;
  description?: string;
  base_price: number;
};

export type PaintType = {
  id: number;
  name: string;
  upcharge_percentage: number;
  upcharge_amount: number;
  description?: string;
};

export type RoomAddOn = {
  id: number;
  name: string;
  cost: number;
  cost_percentage?: number;
  description?: string;
};

export type VolumeDiscount = {
  id: number;
  threshold: number;
  discount_percentage: number;
  description?: string;
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
};
