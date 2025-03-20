
import { RoomDetail, ContactInfo } from '@/types/estimator';

/**
 * Saves estimator data to localStorage
 */
export const saveEstimatorDataToStorage = (rooms: RoomDetail[], contactInfo: ContactInfo): void => {
  localStorage.setItem('estimator-rooms', JSON.stringify(rooms));
  localStorage.setItem('estimator-contact', JSON.stringify(contactInfo));
};

/**
 * Loads rooms data from localStorage
 */
export const loadRoomsFromStorage = (): RoomDetail[] | null => {
  const storedRooms = localStorage.getItem('estimator-rooms');
  if (storedRooms) {
    return JSON.parse(storedRooms);
  }
  return null;
};

/**
 * Loads contact info from localStorage
 */
export const loadContactInfoFromStorage = (): ContactInfo | null => {
  const storedContact = localStorage.getItem('estimator-contact');
  if (storedContact) {
    return JSON.parse(storedContact);
  }
  return null;
};

/**
 * Clears all estimator data from localStorage
 */
export const clearEstimatorStorage = (): void => {
  localStorage.removeItem('estimator-rooms');
  localStorage.removeItem('estimator-contact');
};
