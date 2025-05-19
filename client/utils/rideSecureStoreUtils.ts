import * as SecureStore from 'expo-secure-store';

const ACTIVE_RIDE_ID_KEY = 'activeRideId_v1'; // Added a version to avoid potential conflicts

/**
 * Retrieves the stored active ride ID.
 * @returns A promise that resolves to the ride ID string or null if not found.
 */
export async function getStoredActiveRideId(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(ACTIVE_RIDE_ID_KEY);
  } catch (error) {
    console.error('Error getting stored active ride ID:', error);
    return null;
  }
}

/**
 * Stores the active ride ID.
 * @param rideId The ID of the active ride.
 * @returns A promise that resolves when the operation is complete.
 */
export async function setStoredActiveRideId(rideId: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(ACTIVE_RIDE_ID_KEY, rideId);
  } catch (error) {
    console.error('Error setting stored active ride ID:', error);
  }
}

/**
 * Removes the stored active ride ID.
 * @returns A promise that resolves when the operation is complete.
 */
export async function removeStoredActiveRideId(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(ACTIVE_RIDE_ID_KEY);
  } catch (error) {
    console.error('Error removing stored active ride ID:', error);
  }
}
