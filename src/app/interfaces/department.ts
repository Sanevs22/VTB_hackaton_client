import { Point } from './point';

export interface Department {
  id: number;
  name: string;
  address: string;
  officePoint: Point;
  status: string;
  hasRamp: boolean;
  openHoursData: OpenHoursData[];
  openHoursIndividualData: OpenHoursData[];
  servicesData: {
    id: number;
    name: string;
  }[];
}

export interface OpenHoursData {
  days: string;
  hours: string;
}
