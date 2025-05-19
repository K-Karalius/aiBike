export interface Bike {
  id: string;
  serialNumber: string;
  bikeStatus: BikeStatus;
  latitude: number;
  longitude: number;
  currentStationId?: string;
}

export enum BikeStatus {
  Available = 0,
  Occupied = 1,
  Reserved = 2,
  Unavailable = 3,
  OutOfService = 4,
}

export interface CreateBikeRequest {
  serialNumber: string;
  bikeStatus: BikeStatus;
  latitude: number;
  longitude: number;
  currentStationId?: string;
}

export interface UpdateBikeRequest {
  id: string;
  serialNumber?: string;
  bikeStatus?: BikeStatus;
  latitude?: number;
  longitude?: number;
  currentStationId?: string;
}
