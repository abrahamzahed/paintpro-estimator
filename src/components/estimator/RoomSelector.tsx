
import React, { useEffect, useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { RoomDetail, PricingData } from '@/types/estimator';
import { 
  mockBaseboardTypes, 
  mockRepairOptions, 
  mockFireplaceOptions, 
  mockPaintMethods 
} from '@/lib/mockData';

interface RoomSelectorProps {
  room: RoomDetail;
  pricingData: PricingData;
  onUpdateRoom: (room: RoomDetail) => void;
  onDeleteRoom: (roomId: string) => void;
}

export const RoomSelector: React.FC<RoomSelectorProps> = ({
  room,
  pricingData,
  onUpdateRoom,
  onDeleteRoom,
}) => {
  const [localRoom, setLocalRoom] = useState<RoomDetail>(room);

  // Update calculations whenever the local room changes
  useEffect(() => {
    calculateRoomPrice();
  }, [localRoom]);

  // Send updated room back to parent component
  useEffect(() => {
    onUpdateRoom(localRoom);
  }, [localRoom.price]);

  const calculateRoomPrice = () => {
    const basePrice = localRoom.size.base_price;
    const priceDetails: Record<string, number> = { basePrice };
    
    // Paint type upcharge
    const paintUpchargeAmount = localRoom.paintType.upcharge_amount;
    const paintUpchargePercentage = (basePrice * localRoom.paintType.upcharge_percentage) / 100;
    const paintUpcharge = Math.max(paintUpchargeAmount, paintUpchargePercentage);
    priceDetails.paintUpcharge = paintUpcharge;
    
    // Baseboard upcharge
    const baseboardType = mockBaseboardTypes.find(b => b.name === localRoom.baseboardType);
    const baseboardUpchargePercentage = baseboardType?.upcharge_percentage || 0;
    const baseboardUpcharge = (basePrice * baseboardUpchargePercentage) / 100;
    priceDetails.baseboardUpcharge = baseboardUpcharge;
    
    // High ceiling
    if (localRoom.options.highCeiling) {
      priceDetails.highCeiling = 600;
    }
    
    // Two colors
    if (localRoom.options.twoColors) {
      priceDetails.twoColors = (basePrice * 0.1);
    }
    
    // Millwork priming
    if (localRoom.options.millworkPriming) {
      priceDetails.millworkPriming = (basePrice * 0.5);
    }
    
    // Closets
    const regularClosetPrice = localRoom.closets.regularCount * 150;
    const walkInClosetPrice = localRoom.closets.walkInCount * 300;
    priceDetails.closets = regularClosetPrice + walkInClosetPrice;
    
    // Fireplace
    const fireplaceOption = mockFireplaceOptions.find(f => f.name === localRoom.fireplace);
    if (fireplaceOption && fireplaceOption.cost > 0) {
      priceDetails.fireplace = fireplaceOption.cost;
    }
    
    // Stair railing
    if (localRoom.options.stairRailing) {
      priceDetails.stairRailing = 250;
    }
    
    // Repairs
    const repairOption = mockRepairOptions.find(r => r.name === localRoom.repairs);
    if (repairOption && repairOption.cost > 0) {
      priceDetails.repairs = repairOption.cost;
    }
    
    // Baseboard installation
    if (localRoom.baseboardInstallationFeet > 0) {
      priceDetails.baseboardInstall = localRoom.baseboardInstallationFeet * 2;
    }
    
    // Calculate subtotal before discounts
    let subtotal = Object.values(priceDetails).reduce((sum, value) => sum + value, 0);
    
    // Apply discounts
    if (localRoom.options.emptyRoom) {
      const emptyRoomDiscount = subtotal * 0.15;
      priceDetails.emptyRoomDiscount = -emptyRoomDiscount;
    }
    
    if (localRoom.options.noFloorCovering) {
      const noFloorDiscount = subtotal * 0.05;
      priceDetails.noFloorCoveringDiscount = -noFloorDiscount;
    }
    
    // Calculate final price
    const totalPrice = Object.values(priceDetails).reduce((sum, value) => sum + value, 0);
    
    setLocalRoom(prev => ({
      ...prev,
      price: parseFloat(totalPrice.toFixed(2)),
      priceDetails,
    }));
  };

  const handleRoomTypeChange = (value: string) => {
    const selectedRoomType = pricingData.roomTypes.find(rt => rt.name === value);
    if (selectedRoomType) {
      setLocalRoom(prev => ({ 
        ...prev, 
        roomType: selectedRoomType,
        name: value
      }));
    }
  };

  const handleSizeChange = (value: string) => {
    const selectedSize = pricingData.roomSizes.find(s => s.name === value);
    if (selectedSize) {
      setLocalRoom(prev => ({ ...prev, size: selectedSize }));
    }
  };

  const handlePaintChange = (value: string) => {
    const selectedPaint = pricingData.paintTypes.find(p => p.name === value);
    if (selectedPaint) {
      setLocalRoom(prev => ({ ...prev, paintType: selectedPaint }));
    }
  };

  const handleBaseboardChange = (value: string) => {
    setLocalRoom(prev => ({ ...prev, baseboardType: value }));
  };

  const handleOptionChange = (option: keyof RoomDetail['options'], checked: boolean) => {
    setLocalRoom(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [option]: checked
      }
    }));
  };

  const handleDoorCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setLocalRoom(prev => ({
      ...prev,
      doors: {
        ...prev.doors,
        count
      }
    }));
  };

  const handleDoorPaintMethodChange = (value: string) => {
    setLocalRoom(prev => ({
      ...prev,
      doors: {
        ...prev.doors,
        paintMethod: value as RoomDetail['doors']['paintMethod']
      }
    }));
  };

  const handleWindowCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setLocalRoom(prev => ({
      ...prev,
      windows: {
        ...prev.windows,
        count
      }
    }));
  };

  const handleWindowPaintMethodChange = (value: string) => {
    setLocalRoom(prev => ({
      ...prev,
      windows: {
        ...prev.windows,
        paintMethod: value as RoomDetail['windows']['paintMethod']
      }
    }));
  };

  const handleClosetCountChange = (type: 'walkInCount' | 'regularCount', e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setLocalRoom(prev => ({
      ...prev,
      closets: {
        ...prev.closets,
        [type]: count
      }
    }));
  };

  const handleFireplaceChange = (value: string) => {
    setLocalRoom(prev => ({ ...prev, fireplace: value }));
  };

  const handleRepairsChange = (value: string) => {
    setLocalRoom(prev => ({ ...prev, repairs: value }));
  };

  const handleBaseboardInstallationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const feet = parseInt(e.target.value) || 0;
    setLocalRoom(prev => ({ ...prev, baseboardInstallationFeet: feet }));
  };

  return (
    <div className="room-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{localRoom.name}</h3>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDeleteRoom(localRoom.id)}
        >
          <Trash2 size={18} />
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="form-input-wrapper">
          <Label className="form-label">Room Type</Label>
          <Select 
            value={localRoom.roomType.name} 
            onValueChange={handleRoomTypeChange}
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
            value={localRoom.size.name} 
            onValueChange={handleSizeChange}
          >
            <SelectTrigger className="form-select">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {pricingData.roomSizes.map((size) => (
                <SelectItem key={size.id} value={size.name}>
                  {size.name} (${size.base_price})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="form-input-wrapper">
          <Label className="form-label">Paint Selection</Label>
          <Select 
            value={localRoom.paintType.name} 
            onValueChange={handlePaintChange}
          >
            <SelectTrigger className="form-select">
              <SelectValue placeholder="Select paint type" />
            </SelectTrigger>
            <SelectContent>
              {pricingData.paintTypes.map((paint) => (
                <SelectItem key={paint.id} value={paint.name}>
                  {paint.name} (+{paint.upcharge_percentage}% | +${paint.upcharge_amount})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="form-input-wrapper">
          <Label className="form-label">Baseboard Selection</Label>
          <Select 
            value={localRoom.baseboardType} 
            onValueChange={handleBaseboardChange}
          >
            <SelectTrigger className="form-select">
              <SelectValue placeholder="Select baseboard type" />
            </SelectTrigger>
            <SelectContent>
              {mockBaseboardTypes.map((baseboard) => (
                <SelectItem key={baseboard.id} value={baseboard.name}>
                  {baseboard.name} {baseboard.upcharge_percentage > 0 && `(+${baseboard.upcharge_percentage}%)`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="form-input-wrapper">
          <Label className="form-label">Room Discounts & Options</Label>
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="emptyRoom" 
                checked={localRoom.options.emptyRoom}
                onCheckedChange={(checked) => handleOptionChange('emptyRoom', checked as boolean)}
              />
              <Label htmlFor="emptyRoom" className="cursor-pointer">Empty House (15% discount)</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox 
                id="noFloorCovering" 
                checked={localRoom.options.noFloorCovering}
                onCheckedChange={(checked) => handleOptionChange('noFloorCovering', checked as boolean)}
              />
              <Label htmlFor="noFloorCovering" className="cursor-pointer">No Floor Covering (5% discount)</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox 
                id="twoColors" 
                checked={localRoom.options.twoColors}
                onCheckedChange={(checked) => handleOptionChange('twoColors', checked as boolean)}
              />
              <Label htmlFor="twoColors" className="cursor-pointer">Walls & Ceilings: Two Different Colors (+10%)</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox 
                id="millworkPriming" 
                checked={localRoom.options.millworkPriming}
                onCheckedChange={(checked) => handleOptionChange('millworkPriming', checked as boolean)}
              />
              <Label htmlFor="millworkPriming" className="cursor-pointer">Millwork/Doors Need Priming (+50%)</Label>
            </div>
          </div>
        </div>

        <div className="form-input-wrapper">
          <Label className="form-label">Ceiling Options</Label>
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="highCeiling" 
                checked={localRoom.options.highCeiling}
                onCheckedChange={(checked) => handleOptionChange('highCeiling', checked as boolean)}
              />
              <Label htmlFor="highCeiling" className="cursor-pointer">High Ceiling (+$600)</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox 
                id="paintCeiling" 
                checked={localRoom.options.paintCeiling}
                onCheckedChange={(checked) => handleOptionChange('paintCeiling', checked as boolean)}
              />
              <Label htmlFor="paintCeiling" className="cursor-pointer">Paint Ceiling (+40%)</Label>
            </div>
          </div>
        </div>

        <div className="form-input-wrapper">
          <Label className="form-label">Door Painting</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="doorCount" className="text-sm text-gray-600 mb-1 block">Door Count</Label>
              <Input
                id="doorCount"
                type="number"
                min="0"
                value={localRoom.doors.count}
                onChange={handleDoorCountChange}
                className="form-input"
              />
            </div>
            <div>
              <Label htmlFor="doorPaintMethod" className="text-sm text-gray-600 mb-1 block">Paint Method</Label>
              <Select 
                value={localRoom.doors.paintMethod} 
                onValueChange={handleDoorPaintMethodChange}
              >
                <SelectTrigger className="form-select">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {mockPaintMethods.map((method) => (
                    <SelectItem key={method.id} value={method.name}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="form-input-wrapper">
          <Label className="form-label">Closets</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="walkInClosetCount" className="text-sm text-gray-600 mb-1 block">Walk-in Closet Count</Label>
              <Input
                id="walkInClosetCount"
                type="number"
                min="0"
                value={localRoom.closets.walkInCount}
                onChange={(e) => handleClosetCountChange('walkInCount', e)}
                className="form-input"
              />
            </div>
            <div>
              <Label htmlFor="regularClosetCount" className="text-sm text-gray-600 mb-1 block">Regular Closet Count</Label>
              <Input
                id="regularClosetCount"
                type="number"
                min="0"
                value={localRoom.closets.regularCount}
                onChange={(e) => handleClosetCountChange('regularCount', e)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="form-input-wrapper">
          <Label className="form-label">Windows</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="windowCount" className="text-sm text-gray-600 mb-1 block">Window Count</Label>
              <Input
                id="windowCount"
                type="number"
                min="0"
                value={localRoom.windows.count}
                onChange={handleWindowCountChange}
                className="form-input"
              />
            </div>
            <div>
              <Label htmlFor="windowPaintMethod" className="text-sm text-gray-600 mb-1 block">Paint Method</Label>
              <Select 
                value={localRoom.windows.paintMethod} 
                onValueChange={handleWindowPaintMethodChange}
              >
                <SelectTrigger className="form-select">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {mockPaintMethods.map((method) => (
                    <SelectItem key={method.id} value={method.name}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="form-input-wrapper">
          <Label className="form-label">Fireplace Mantel</Label>
          <Select 
            value={localRoom.fireplace} 
            onValueChange={handleFireplaceChange}
          >
            <SelectTrigger className="form-select">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {mockFireplaceOptions.map((option) => (
                <SelectItem key={option.id} value={option.name}>
                  {option.name} {option.cost > 0 && `(+$${option.cost})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="form-input-wrapper">
          <Label className="form-label">Stair Railing</Label>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="stairRailing" 
                checked={localRoom.options.stairRailing}
                onCheckedChange={(checked) => handleOptionChange('stairRailing', checked as boolean)}
              />
              <Label htmlFor="stairRailing" className="cursor-pointer">Staircase Railing to Paint (+$250)</Label>
            </div>
          </div>
        </div>

        <div className="form-input-wrapper">
          <Label className="form-label">Repairs</Label>
          <Select 
            value={localRoom.repairs} 
            onValueChange={handleRepairsChange}
          >
            <SelectTrigger className="form-select">
              <SelectValue placeholder="Select repair option" />
            </SelectTrigger>
            <SelectContent>
              {mockRepairOptions.map((option) => (
                <SelectItem key={option.id} value={option.name}>
                  {option.name} {option.cost > 0 && `(+$${option.cost})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="form-input-wrapper">
          <Label htmlFor="baseboardInstallation" className="form-label">Baseboard Installation (LF)</Label>
          <Input
            id="baseboardInstallation"
            type="number"
            min="0"
            value={localRoom.baseboardInstallationFeet}
            onChange={handleBaseboardInstallationChange}
            className="form-input"
          />
        </div>
      </div>
    </div>
  );
};
