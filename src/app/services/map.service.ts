import { Injectable, OnInit } from '@angular/core';
import { Point } from '../interfaces/point';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  public userCoordinates = new BehaviorSubject<Point>({
    lat: 55.751426,
    lon: 37.618879,
  });

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
}
