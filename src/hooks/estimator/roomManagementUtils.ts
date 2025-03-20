
import { RoomDetail, PricingData } from '@/types/estimator';
import { createDefaultRoom } from './roomUtils';
import { toast } from 'sonner';

interface RoomManagementProps {
  rooms: RoomDetail[];
  setRooms: React.Dispatch<React.SetStateAction<RoomDetail[]>>;
  pricingData: PricingData | null;
}

export const useRoomManagement = ({
  rooms,
  setRooms,
  pricingData
}: RoomManagementProps) => {
  
  const handleAddRoom = () => {
    if (!pricingData) return;
    
    const newRoom = createDefaultRoom(pricingData);
    if (newRoom) {
      setRooms([...rooms, newRoom]);
    }
  };

  const handleUpdateRoom = (updatedRoom: RoomDetail) => {
    setRooms(rooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room)));
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter((room) => room.id !== roomId));
    toast.success('Room removed successfully');
  };

  return {
    handleAddRoom,
    handleUpdateRoom,
    handleDeleteRoom
  };
};
