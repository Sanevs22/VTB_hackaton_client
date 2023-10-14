import { Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { BehaviorSubject, Subscription, debounceTime, skip, take } from 'rxjs';
import { Department } from 'src/app/interfaces/department';
import { Point } from 'src/app/interfaces/point';
import { ApiService } from 'src/app/services/api.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less'],
})
export class MapComponent implements OnInit, OnDestroy {
  private subUserCoordinates!: Subscription;

  private map!: L.Map;
  private userMarker!: L.Marker;
  private userMarkerIcon = L.icon({
    iconUrl: './assets/markerUser.png',
  });

  private departmentMarkerIcon = L.icon({
    iconUrl: './assets/marketDepartment.png',
  });

  departments: Department[] = [];
  private departmentMarkers: L.Marker[] = [];

  public moveEvent = new BehaviorSubject<{ zoom: number; point: Point }>({
    zoom: 15,
    point: {
      lon: 37.631299,
      lat: 55.757009,
    },
  });

  constructor(
    private readonly mapService: MapService,
    private readonly apiService: ApiService
  ) {}

  public ngOnInit(): void {
    this.initMap();
    this.getUserGeolocation();
    this.drowDepartmentMarket();

    this.map.on('move', () => {
      this.moveEvent.next({
        zoom: this.map.getZoom(),
        point: {
          lon: this.map.getCenter().lng,
          lat: this.map.getCenter().lat,
        },
      });
    });

    this.moveEvent.pipe(debounceTime(300)).subscribe((e) => {
      this.apiService.getDepartmentsList(e.point, e.zoom);
    });
  }

  public ngOnDestroy(): void {
    this.subUserCoordinates.unsubscribe();
  }
  private initMap() {
    this.map = L.map('map', {
      zoomControl: false,
      minZoom: 13,
      maxZoom: 17,
    }).setView([55.757009, 37.631299], 15);
    L.tileLayer(
      'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=VJR3KKJXMRREHh1i0Opj',
      {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    ).addTo(this.map);
  }

  private getUserGeolocation() {
    this.subUserCoordinates = this.mapService.userCoordinates
      .pipe(skip(1))
      .subscribe((point) => {
        this.drowMarket(point);
        this.map.setView([point.lat, point.lon], 15);
      });
  }

  private drowMarket(point: Point) {
    if (this.userMarker) this.userMarker.remove();
    this.userMarker = L.marker([point.lat, point.lon], {
      icon: this.userMarkerIcon,
    }).addTo(this.map);
  }

  private async drowDepartmentMarket() {
    this.departments = await this.apiService.getDepartments();
    this.departmentMarkers.map((i) => i.remove());
    this.departmentMarkers = [];
    if (this.departments.length > 0) {
      this.departments.map((i) => {
        const marker = L.marker([i.officePoint.lat, i.officePoint.lon], {
          icon: this.departmentMarkerIcon,
        }).addTo(this.map);
        this.departmentMarkers.push(marker);
      });
    }
  }
}
