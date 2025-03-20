
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RoomDetail, PricingData, RoomType } from '@/types/estimator';

interface RoomBasicInfoProps {
  room: RoomDetail;
  pricingData: PricingData;
  availableSizes: Array<any>;
  onRoomTypeChange: (value: string) => void;
  onSizeChange: (sizeId: string) => void;
  onPaintChange: (value: string) => void;
}

export const RoomBasicInfo: React.FC<RoomBasicInfoProps> = ({
  room,
  pricingData,
  availableSizes,
  onRoomTypeChange,
  onSizeChange,
  onPaintChange,
}) => {
  return (
    <>
      <div className="form-input-wrapper">
        <Label className="form-label">Room Type</Label>
        <Select 
          value={room.roomType.name} 
          onValueChange={onRoomTypeChange}
        >
          <SelectTrigger className="form-select">
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent>
            {pricingData.roomTypes.map((type) => (
              <SelectItem key={type.id} value={type.name}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="form-input-wrapper">
        <Label className="form-label">Size</Label>
        <Select 
          value={room.size.id}
          onValueChange={onSizeChange}
          disabled={availableSizes.length === 0}
        >
          <SelectTrigger className="form-select">
            <SelectValue placeholder="Select size">
              {room.size.size && room.size.size}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {availableSizes.map((size) => (
              <SelectItem key={size.id} value={size.id}>
                {size.size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="form-input-wrapper">
        <Label className="form-label">Paint Selection</Label>
        <Select 
          value={room.paintType.name} 
          onValueChange={onPaintChange}
        >
          <SelectTrigger className="form-select">
            <SelectValue placeholder="Select paint type" />
          </SelectTrigger>
          <SelectContent>
            {pricingData.paintTypes.map((paint) => (
              <SelectItem key={paint.id} value={paint.name}>
                {paint.name}
                {paint.upcharge_percentage === 0 && paint.upcharge_amount === 0 ? 
                  ' (no upcharge)' : 
                  paint.upcharge_percentage > 0 && paint.upcharge_amount > 0 ? 
                    ` (+${paint.upcharge_percentage}%) (+$${paint.upcharge_amount.toFixed(2)})` :
                    paint.upcharge_percentage > 0 ? 
                      ` (+${paint.upcharge_percentage}%)` : 
                      ` (+$${paint.upcharge_amount.toFixed(2)})`
                }
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
