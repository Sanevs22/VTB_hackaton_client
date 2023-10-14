import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Point } from '../interfaces/point';
import { Observable, firstValueFrom } from 'rxjs';
import { Address } from '../interfaces/address';

const URL = 'https://73fqls6k-5211.euw.devtunnels.ms';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  public async getAddressFromPoint(point: Point) {
    const address = await firstValueFrom(
      this.http.get<Address>(
        `${URL}/api/User?lon=${point.lon}&lat=${point.lat}`
      )
    );
    return address;
  }
}