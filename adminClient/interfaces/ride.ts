export enum RideStatus {
  Started = 0,
  Finished = 1,
  Cancelled = 2,
}

export interface Ride {
  id: string;
  userId: string;
  bikeId: string;
  startStationId: string | null;
  endStationId: string | null;
  startedAtUTC: string;
  finishedAtUTC: string | null;
  distanceMeters: number;
  fareAmount: number;
  rideStatus: RideStatus;
}

export interface CreateRideRequest {
  userId: string;
  bikeId: string;
  startStationId: string | null;
  rideStatus: RideStatus;
}

export interface UpdateRideRequest {
  id: string;
  userId: string;
  bikeId: string | null;
  startStationId: string | null;
  endStationId: string | null;
  startedAtUTC: string | null;
  finishedAtUTC: string | null;
  distanceMeters: number;
  fareAmount: number;
  rideStatus: RideStatus;
}
