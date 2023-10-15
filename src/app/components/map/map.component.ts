import { Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import {
  BehaviorSubject,
  Subscription,
  debounceTime,
  filter,
  skip,
  take,
} from 'rxjs';
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

  private homeIcon = L.icon({
    iconUrl: './assets/home.png',
    iconSize: [62, 62],
  });

  private boxIcon = L.icon({
    iconUrl: './assets/box.png',
    iconSize: [62, 62],
  });

  private aitIcon = L.icon({
    iconUrl: './assets/air.png',
    iconSize: [92, 92],
  });

  departments: Department[] = [];
  private departmentMarkers: L.Marker[] = [];

  mapPath!: L.Polyline;

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
      this.mapService.getDepartmentsList(e.point, e.zoom);
    });
    this.mapService.currensView
      .pipe(skip(1))
      .subscribe((p) => this.map.setView([p.lat, p.lon], 17));
    this.drowPath();

    this.apiService.departmentOptimal
      .pipe(skip(1))
      .subscribe((e) => this.showDepartment(e[0].officePoint));
    this.partner();
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
    this.mapService.departmentListText.pipe(skip(1)).subscribe((dep) => {
      this.departments = dep;
      this.departmentMarkers.map((i) => i.clearAllEventListeners());
      this.departmentMarkers.map((i) => i.remove());
      this.departmentMarkers = [];
      if (this.departments.length > 0) {
        this.departments.map((i) => {
          const marker = L.marker([i.officePoint.lat, i.officePoint.lon], {
            icon: this.departmentMarkerIcon,
          }).addTo(this.map);
          marker.addEventListener('click', (e) => {
            let p: Point = {
              lat: e.latlng.lat,
              lon: e.latlng.lng,
            };
            this.showDepartment(p);
          });
          this.departmentMarkers.push(marker);
        });
      }
    });
  }

  private drowPath() {
    this.apiService.mapPath.pipe(skip(1)).subscribe((item) => {
      if (this.mapPath) {
        this.mapPath.remove();
      }

      const polylineArr = item.coordinates.map(
        (i) => new L.LatLng(i.lat, i.lon)
      );
      this.mapPath = L.polyline(polylineArr, { color: 'blue' }).addTo(this.map);
      this.map.fitBounds(this.mapPath.getBounds());
    });
  }

  showDepartment(e: Point) {
    this.mapService.currentOpenDepartment.next({
      lat: e.lat,
      lon: e.lon,
    });
    this.map.setView([e.lat, e.lon], 17);
  }

  partner() {
    L.marker([55.7561, 37.6342], {
      icon: this.homeIcon,
    })
      .addTo(this.map)
      .bindPopup(
        '<strong> Льготная ипотека на строительство дома от 4,6%</strong> <br/>Купите земельный участок и постройте дом вашей мечты с льготной ипотекой <a href="https://www.vtb.ru/personal/ipoteka/"  target="_blank">у нас на сайте </a>'
      )
      .openPopup();

    L.marker([55.75, 37.6], {
      icon: this.boxIcon,
    })
      .addTo(this.map)
      .bindPopup(
        '<strong>Получи "Мультибонус" </strong> <br/>Кешбэк до 30% Мультибонусами за покупки у партнёров <a href="https://multibonus.ru/"  target="_blank">у нас на сайте </a>'
      )
      .openPopup();

    L.marker([55.6053, 37.2872], {
      icon: this.aitIcon,
    })
      .addTo(this.map)
      .bindPopup(
        '<strong>Путешествуйте с комфортом </strong> <br/>Более 100 бизнес-залов Для вас и ваших спутников, независимо от того, как вы путешествуете: самолетом или поездом <a href="https://www.vtb.ru/privilegia/mir-pass/"  target="_blank">у нас на сайте </a>'
      )
      .openPopup();
  }
}
