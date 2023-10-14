import { Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Subscription, skip } from 'rxjs';
import { Point } from 'src/app/interfaces/point';
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

  constructor(private readonly mapService: MapService) {}

  public ngOnInit(): void {
    this.initMap();
    this.getUserGeolocation();
  }

  public ngOnDestroy(): void {
    this.subUserCoordinates.unsubscribe();
  }

  private initMap() {
    this.map = L.map('map', { zoomControl: false });
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
}
