export interface Ride {
  id: string;
  userId: string;
  bikeId: string;
  startStationId: string;
  endStationId?: string;
  startedAtUTC: Date;
  finishedAtUTC?: Date;
  rideStatus: RideStatus;
  fareAmount: number;
  distanceMeters: number;
}

export enum RideStatus {
  Ongoing = 0,
  Finished = 1,
  Cancelled = 2,
}

export interface CreateRideRequest {
  bikeId: string;
  startStationId: string;
}

export interface EndRideRequest {
  id: string;
}

export interface EndRideResponse {
  totalDurationMinutes: number;
  fare: number;
}
