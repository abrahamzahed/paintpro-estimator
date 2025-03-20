
import React from 'react';
import { SelectField } from './SelectField';
import { PricingData } from '@/types/estimator';

interface RoomTypeSelectorProps {
  roomType: { name: string };
  pricingData: PricingData;
  onRoomTypeChange: (value: string) => void;
}

export const RoomTypeSelector: React.FC<RoomTypeSelectorProps> = ({
  roomType,
  pricingData,
  onRoomTypeChange
}) => {
  return (
    <SelectField
      label="Room Type"
      value={roomType.name}
      onValueChange={onRoomTypeChange}
      options={pricingData.roomTypes}
      placeholder="Select room type"
    />
  );
};
