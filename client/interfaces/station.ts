export interface Station {
  id: string;
  name: string;
  capacity: number;
  latitude: number;
  longitude: number;
  bikeCount: number;
}

export interface GetStationRangeResponse {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  items: Station[];
}

export interface CreateStationRequest {
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
}

export interface GetStationsRequest {
  latitude: number;
  longitude: number;
  radiusKm: number;
  page?: number;
  pageSize?: number;
}

export interface PatchStationRequest {
  id: string;
  name: string;
  capacity: number;
  longitude: number;
  latitude: number;
}
