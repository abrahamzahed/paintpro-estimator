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
import { RoomDetail, PricingData, BaseboardType } from '@/types/estimator';

// Mock repair options (these should eventually come from Supabase too)
const mockRepairOptions = [
  { id: 1, name: 'No Repairs', cost: 0 },
  { id: 2, name: 'Minor Repairs', cost: 250 },
  { id: 3, name: 'Major Repairs', cost: 750 }
];

// Updated fireplace options
const mockFireplaceOptions = [
  { id: 1, name: 'None', cost: 0 },
  { id: 2, name: 'Brush Mantel', cost: 100 },
  { id: 3, name: 'Spray Mantel', cost: 225 }
];

const mockPaintMethods = [
  { id: 1, name: 'Spray' },
  { id: 2, name: 'Brush' },
  { id: 3, name: 'Roll' }
];

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
  const [availableSizes, setAvailableSizes] = useState<Array<any>>([]);
  
  // Set available room sizes when room type changes
  useEffect(() => {
    if (pricingData && localRoom.roomType) {
      const filteredSizes = pricingData.roomSizes.filter(
        size => size.room_type_id === localRoom.roomType.id
      );
      setAvailableSizes(filteredSizes);
      
      // If current size is not available for this room type, reset to average size
      if (filteredSizes.length > 0) {
        const currentSizeExists = filteredSizes.some(size => size.id === localRoom.size.id);
        if (!currentSizeExists) {
          // Find the average size (middle index) instead of the first size
          const middleIndex = Math.floor(filteredSizes.length / 2);
          handleSizeChange(filteredSizes[middleIndex].id);
        }
      }
    }
  }, [localRoom.roomType, pricingData]);

  // Check if millwork priming should be disabled 
  const shouldDisableMillworkPriming = () => {
    // Only disable if ALL millwork elements are missing 
    // (changed from OR to AND conditions)
    return (
      localRoom.baseboardType === 'No Baseboards' && 
      localRoom.doors.count === 0 && 
      localRoom.closets.walkInCount === 0 && 
      localRoom.closets.regularCount === 0 && 
      localRoom.windows.count === 0
    );
  };

  // Update millwork priming when conditions change
  useEffect(() => {
    if (shouldDisableMillworkPriming() && localRoom.options.millworkPriming) {
      // If conditions now require disabling and it was checked, uncheck it
      setLocalRoom(prev => ({
        ...prev,
        options: {
          ...prev.options,
          millworkPriming: false
        }
      }));
    }
  }, [
    localRoom.baseboardType, 
    localRoom.doors.count, 
    localRoom.closets.walkInCount,
    localRoom.closets.regularCount,
    localRoom.windows.count
  ]);

  // Update calculations whenever the local room changes
  useEffect(() => {
    calculateRoomPrice();
  }, [localRoom]);

  // Send updated room back to parent component
  useEffect(() => {
    onUpdateRoom(localRoom);
  }, [localRoom.price]);

  const calculateRoomPrice = () => {
    if (!pricingData) return;
    
    const basePrice = localRoom.size.base_price;
    const priceDetails: Record<string, number> = { basePrice };
    
    // Paint type upcharge
    const paintUpchargeAmount = localRoom.paintType.upcharge_amount;
    const paintUpchargePercentage = (basePrice * localRoom.paintType.upcharge_percentage) / 100;
    const paintUpcharge = Math.max(paintUpchargeAmount, paintUpchargePercentage);
    priceDetails.paintUpcharge = paintUpcharge;
    
    // Baseboard upcharge
    let baseboardUpchargePercentage = 0;
    if (localRoom.baseboardType === 'Brushed Baseboards') {
      baseboardUpchargePercentage = 25;
    } else if (localRoom.baseboardType === 'Sprayed Baseboards') {
      baseboardUpchargePercentage = 50;
    }
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
    
    // Apply room-specific add-ons from Supabase
    pricingData.roomAddons.forEach(addon => {
      if (localRoom.options[addon.name as keyof typeof localRoom.options]) {
        const addonCost = addon.cost_percentage ? 
          basePrice * (addon.cost_percentage / 100) : addon.cost;
        priceDetails[addon.name] = addonCost;
      }
    });
    
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

  const handleSizeChange = (sizeId: string) => {
    const selectedSize = pricingData.roomSizes.find(s => s.id === sizeId);
    if (selectedSize) {
      setLocalRoom(prev => ({ 
        ...prev, 
        size: selectedSize 
      }));
    }
  };

  const handlePaintChange = (value: string) => {
    const selectedPaint = pricingData.paintTypes.find(p => p.name === value);
    if (selectedPaint) {
      setLocalRoom(prev => ({ ...prev, paintType: selectedPaint }));
    }
  };

  const handleBaseboardChange = (value: BaseboardType) => {
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
            value={localRoom.size.id}
            onValueChange={handleSizeChange}
            disabled={availableSizes.length === 0}
          >
            <SelectTrigger className="form-select">
              <SelectValue placeholder="Select size">
                {localRoom.size.size && localRoom.size.size}
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
            value={localRoom.paintType.name} 
            onValueChange={handlePaintChange}
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

        <div className="form-input-wrapper">
          <Label className="form-label">Baseboard Selection</Label>
          <Select 
            value={localRoom.baseboardType} 
            onValueChange={(value) => handleBaseboardChange(value as BaseboardType)}
          >
            <SelectTrigger className="form-select">
              <SelectValue placeholder="Select baseboard type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No Baseboards">No Baseboards</SelectItem>
              <SelectItem value="Brushed Baseboards">Brushed Baseboards (+25%)</SelectItem>
              <SelectItem value="Sprayed Baseboards">Sprayed Baseboards (+50%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="form-input-wrapper">
          <Label className="form-label">Room Discounts & Options</Label>
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox 
                id={`emptyRoom-${localRoom.id}`}
                checked={localRoom.options.emptyRoom}
                onCheckedChange={(checked) => handleOptionChange('emptyRoom', checked as boolean)}
              />
              <Label htmlFor={`emptyRoom-${localRoom.id}`} className="cursor-pointer">Empty Room (15% discount)</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox 
                id={`noFloorCovering-${localRoom.id}`}
                checked={localRoom.options.noFloorCovering}
                onCheckedChange={(checked) => handleOptionChange('noFloorCovering', checked as boolean)}
              />
              <Label htmlFor={`noFloorCovering-${localRoom.id}`} className="cursor-pointer">No Floor Covering (5% discount)</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox 
                id={`twoColors-${localRoom.id}`}
                checked={localRoom.options.twoColors}
                onCheckedChange={(checked) => handleOptionChange('twoColors', checked as boolean)}
              />
              <Label htmlFor={`twoColors-${localRoom.id}`} className="cursor-pointer">Walls & Ceilings: Two Different Colors (+10%)</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox 
                id={`millworkPriming-${localRoom.id}`}
                checked={localRoom.options.millworkPriming}
                disabled={shouldDisableMillworkPriming()}
                onCheckedChange={(checked) => handleOptionChange('millworkPriming', checked as boolean)}
                className={shouldDisableMillworkPriming() ? "opacity-50" : ""}
              />
              <Label 
                htmlFor={`millworkPriming-${localRoom.id}`}
                className={`cursor-pointer ${shouldDisableMillworkPriming() ? "text-gray-400" : ""}`}
              >
                Millwork/Doors Need Priming (+50%)
              </Label>
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

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-lg mb-3">Cost Summary</h4>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-semibold">{localRoom.name}</h5>
            <span className="font-semibold">${localRoom.price.toFixed(2)}</span>
          </div>
          
          <div className="space-y-1 text-sm">
            {Object.entries(localRoom.priceDetails).map(([key, value]) => {
              // Skip displaying items with zero value
              if (value === 0) return null;
              
              // Format key for display
              const formatKey = (key: string) => {
                if (key === 'basePrice') return 'Base Price';
                if (key === 'paintUpcharge') return 'Paint Upcharge';
                if (key === 'baseboardUpcharge') return 'Baseboards';
                if (key === 'highCeiling') return 'High Ceiling';
                if (key === 'twoColors') return 'Two-Color';
                if (key === 'millworkPriming') return 'Millwork Priming';
                if (key === 'closets') return 'Closets';
                if (key === 'fireplace') return 'Fireplace';
                if (key === 'stairRailing') return 'Stair Railing';
                if (key === 'repairs') return 'Repairs';
                if (key === 'baseboardInstall') return 'Baseboard Install';
                if (key === 'emptyRoomDiscount') return 'Empty House Discount';
                if (key === 'noFloorCoveringDiscount') return 'No Floor Covering Discount';
                
                return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
              };
              
              // Format negative values as discounts in green
              const isDiscount = value < 0;
              const formattedValue = `${isDiscount ? '-' : '+'}$${Math.abs(value).toFixed(2)}`;
              
              return (
                <div key={key} className="flex justify-between">
                  <span>{formatKey(key)}:</span>
                  <span className={isDiscount ? 'text-green-600 font-medium' : undefined}>
                    {formattedValue}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
