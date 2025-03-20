
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
  
  // Updated to support both with and without argument
  const handleAddRoom = (room?: RoomDetail) => {
    if (!pricingData) return;
    
    // If a room is provided, use it; otherwise create a new default room
    const newRoom = room || createDefaultRoom(pricingData);
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
