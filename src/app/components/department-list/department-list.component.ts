import { Component, Inject, Input, OnInit } from '@angular/core';
import { BehaviorSubject, skip } from 'rxjs';
import { Department } from 'src/app/interfaces/department';
import { MapService } from 'src/app/services/map.service';
import { TuiAlertService } from '@taiga-ui/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.less'],
})
export class DepartmentListComponent implements OnInit {
  @Input()
  departmentList: Department[] | null = [];

  public isOpen: 'list' | 'depart' | 'path' = 'list';
  quize = 'none';

  currentDepartment = new BehaviorSubject<Department>({
    id: -1,
    name: '',
    address: '',
    officePoint: { lat: -1, lon: -1 },
    status: '',
    hasRamp: null,
    openHoursData: [],
    openHoursIndividualData: [],
    servicesData: [],
  });

  constructor(
    private readonly mapService: MapService,
    public readonly apiService: ApiService,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService
  ) {}
  ngOnInit(): void {
    this.mapService.currentOpenDepartment.pipe(skip(1)).subscribe((p) => {
      if (this.departmentList) {
        this.currentDepartment.next(
          this.departmentList.filter((i) => i.officePoint.lat === p.lat)[0]
        );
      }
      this.isOpen = 'depart';
    });
  }

  selectDepartment(department: Department) {
    this.mapService.setView(department.officePoint);
    console.log(department);
    this.currentDepartment.next(department);
    this.isOpen = 'depart';
  }

  close() {
    this.isOpen = 'list';
  }

  setPath() {
    const from = this.mapService.userCoordinates.getValue();
    const to = this.currentDepartment.getValue();

    if (from.lat > 0) {
      this.apiService.getPath(from, to.officePoint, 'car');
      this.isOpen = 'path';
    } else {
      this.alerts
        .open('Введите свой адрес, чтобы проложить маршрут', {
          status: 'warning',
        })
        .subscribe();
    }
  }

  startQuize() {
    this.quize = 'start';
  }

  getTicket() {
    this.quize = 'ticket';
  }
}
