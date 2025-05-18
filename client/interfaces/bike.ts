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
}
