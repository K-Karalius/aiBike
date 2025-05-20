export enum BikeStatus {
  Available,
  Occupied,
  Reserved,
  Unavailable,
}

export interface Bike {
  id: string;
  serialNumber: string;
  bikeStatus: BikeStatus;
  currentStationId?: string;
  longitude: number;
  latitude: number;
}

export interface CreateBikeRequest {
  serialNumber: string;
  bikeStatus: BikeStatus;
  currentStationId?: string;
  longitude: number;
  latitude: number;
}

export interface UpdateBikeRequest {
  id: string;
  serialNumber?: string;
  bikeStatus?: BikeStatus;
  latitude?: number;
  longitude?: number;
  currentStationId?: string;
}

export interface GetBikesResponse {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  items: Bike[];
}
