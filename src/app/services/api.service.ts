import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Point } from '../interfaces/point';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Address } from '../interfaces/address';
import { Department } from '../interfaces/department';
import { offeser } from './offeser';

const URL = 'https://73fqls6k-5211.euw.devtunnels.ms';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public departmentList = new BehaviorSubject<Department[]>([]);
  public departmentListText = new BehaviorSubject<Department[]>([]);

  constructor(private readonly http: HttpClient) {}

  public async getAddressFromPoint(point: Point) {
    const address = await firstValueFrom(
      this.http.get<Address>(
        `${URL}/api/User?lon=${point.lon}&lat=${point.lat}`
      )
    );
    return address;
  }

  public async getPointFromAddress(address: string) {
    const point = await firstValueFrom(
      this.http.get<{ displayName: string; point: Point }[]>(
        `${URL}/api/User/address/${address}`
      )
    );
    return point;
  }

  public async getDepartments() {
    const department = offeser;
    this.departmentList.next(department);
    return department;
  }

  public getDepartmentsList(point: Point, zoom: number) {
    const department = offeser
      .filter(
        (i) =>
          i.officePoint.lat < point.lat + 0.0002 * ((18 - zoom) * 20) &&
          i.officePoint.lat > point.lat - 0.0002 * ((18 - zoom) * 20)
      )
      .filter(
        (i) =>
          i.officePoint.lon < point.lon + 0.0002 * ((18 - zoom) * 20) &&
          i.officePoint.lon > point.lon - 0.0002 * ((18 - zoom) * 20)
      );
    this.departmentListText.next(department);
  }
}
