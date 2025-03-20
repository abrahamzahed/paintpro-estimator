
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { RoomDetail, PricingData, BaseboardType } from '@/types/estimator';
import { RoomTypeSelector } from './room-selector/RoomTypeSelector';
import { SelectField } from './room-selector/SelectField';
import { RoomDiscounts } from './room-selector/RoomDiscounts';
import { CeilingOptions } from './room-selector/CeilingOptions';
import { DoorSection } from './room-selector/DoorSection';
import { ClosetSection } from './room-selector/ClosetSection';
import { WindowSection } from './room-selector/WindowSection';
import { StairRailingOption } from './room-selector/StairRailingOption';
import { NumberInputField } from './room-selector/NumberInputField';
import { getMockRepairOptions, getMockFireplaceOptions } from '@/utils/estimator/priceCalculator';
import { useRoomSelector } from '@/hooks/estimator/useRoomSelector';

// Get mock options from the utility file
const mockRepairOptions = getMockRepairOptions();
const mockFireplaceOptions = getMockFireplaceOptions();

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
  const {
    localRoom,
    availableSizes,
    shouldDisableMillworkPriming,
    handleRoomTypeChange,
    handleSizeChange,
    handlePaintChange,
    handleBaseboardChange,
    handleOptionChange,
    handleDoorCountChange,
    handleDoorPaintMethodChange,
    handleWindowCountChange,
    handleWindowPaintMethodChange,
    handleClosetCountChange,
    handleFireplaceChange,
    handleRepairsChange,
    handleBaseboardInstallationChange
  } = useRoomSelector(room, pricingData, onUpdateRoom);

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
        <RoomTypeSelector 
          roomType={localRoom.roomType}
          pricingData={pricingData}
          onRoomTypeChange={handleRoomTypeChange}
        />

        <div className="form-input-wrapper">
          <SelectField
            label="Size"
            value={localRoom.size.id}
            onValueChange={handleSizeChange}
            options={availableSizes.map(size => ({ 
              ...size, 
              name: size.size 
            }))}
            placeholder="Select size"
            disabled={availableSizes.length === 0}
          />
        </div>

        <SelectField
          label="Paint Selection"
          value={localRoom.paintType.name}
          onValueChange={handlePaintChange}
          options={pricingData.paintTypes}
          placeholder="Select paint type"
        />

        <SelectField
          label="Baseboard Selection"
          value={localRoom.baseboardType}
          onValueChange={(value) => handleBaseboardChange(value as BaseboardType)}
          options={[
            { id: 1, name: 'No Baseboards' },
            { id: 2, name: 'Brushed Baseboards', upcharge_percentage: 25 },
            { id: 3, name: 'Sprayed Baseboards', upcharge_percentage: 50 }
          ]}
          placeholder="Select baseboard type"
        />

        <RoomDiscounts 
          options={localRoom.options}
          handleOptionChange={handleOptionChange}
          shouldDisableMillworkPriming={shouldDisableMillworkPriming}
        />

        <CeilingOptions 
          options={localRoom.options}
          handleOptionChange={handleOptionChange}
        />

        <DoorSection
          doors={localRoom.doors}
          handleDoorCountChange={handleDoorCountChange}
          handleDoorPaintMethodChange={handleDoorPaintMethodChange}
        />

        <ClosetSection
          closets={localRoom.closets}
          handleClosetCountChange={handleClosetCountChange}
        />

        <WindowSection
          windows={localRoom.windows}
          handleWindowCountChange={handleWindowCountChange}
          handleWindowPaintMethodChange={handleWindowPaintMethodChange}
        />

        <SelectField
          label="Fireplace Mantel"
          value={localRoom.fireplace}
          onValueChange={handleFireplaceChange}
          options={mockFireplaceOptions}
          placeholder="Select option"
        />

        <StairRailingOption
          options={localRoom.options}
          handleOptionChange={handleOptionChange}
        />

        <SelectField
          label="Repairs"
          value={localRoom.repairs}
          onValueChange={handleRepairsChange}
          options={mockRepairOptions}
          placeholder="Select repair option"
        />

        <NumberInputField
          id="baseboardInstallation"
          label="Baseboard Installation (LF)"
          value={localRoom.baseboardInstallationFeet}
          onChange={handleBaseboardInstallationChange}
        />
      </div>
    </div>
  );
};
