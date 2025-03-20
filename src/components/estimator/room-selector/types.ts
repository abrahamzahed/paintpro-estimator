
import { RoomDetail, BaseboardType, PaintMethod } from '@/types/estimator';

export interface RoomSelectorProps {
  room: RoomDetail;
  pricingData: any;
  onUpdateRoom: (room: RoomDetail) => void;
  onDeleteRoom: (roomId: string) => void;
}

export interface RoomOptionProps {
  option: keyof RoomDetail['options'];
  checked: boolean;
  onChange: (option: keyof RoomDetail['options'], checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ id: string | number; name: string; cost?: number; upcharge_percentage?: number; upcharge_amount?: number; }>;
  placeholder?: string;
  disabled?: boolean;
}

export interface NumberInputFieldProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  id: string;
}
