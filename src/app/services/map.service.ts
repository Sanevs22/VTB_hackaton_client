import { Injectable, OnInit } from '@angular/core';
import { Point } from '../interfaces/point';
import { BehaviorSubject } from 'rxjs';
import { offeser } from './offeser';
import { Department } from '../interfaces/department';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  public userCoordinates = new BehaviorSubject<Point>({
    lat: -55.751426,
    lon: -37.618879,
  });

  public currensView = new BehaviorSubject<Point>({ lat: 55, lon: 32 });
  public currentOpenDepartment = new BehaviorSubject<Point>({
    lat: 55,
    lon: 32,
  });

  public departmentListText = new BehaviorSubject<Department[]>([]);

  constructor() {
    this.getUserGeolocation();
  }

  private getUserGeolocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let point: Point = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        this.userCoordinates.next(point);
      },
      (err) => console.log(err)
    );
  }

  public setUserGeolocation(point: Point) {
    this.userCoordinates.next(point);
  }

  public setView(point: Point) {
    this.currensView.next(point);
  }

  public getDepartmentsList(point: Point, zoom: number) {
    const department = offeser
      .filter((i) => {
        if (zoom === 17) {
          return (
            i.officePoint.lat < point.lat + 0.0002 * ((18 - zoom) * 10) &&
            i.officePoint.lat > point.lat - 0.0002 * ((18 - zoom) * 10)
          );
        }
        return (
          i.officePoint.lat < point.lat + 0.0002 * ((18 - zoom) * 25) &&
          i.officePoint.lat > point.lat - 0.0002 * ((18 - zoom) * 25)
        );
      })
      .filter((i) => {
        if (zoom === 17) {
          return (
            i.officePoint.lon < point.lon + 0.0002 * ((18 - zoom) * 15) &&
            i.officePoint.lon > point.lon - 0.0002 * ((18 - zoom) * 15)
          );
        }
        return (
          i.officePoint.lon < point.lon + 0.0002 * ((18 - zoom) * 40) &&
          i.officePoint.lon > point.lon - 0.0002 * ((18 - zoom) * 40)
        );
      });
    this.departmentListText.next(department);
  }
}
