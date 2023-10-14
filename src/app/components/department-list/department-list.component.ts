import { Component, Inject, Input, OnInit } from '@angular/core';
import { BehaviorSubject, skip } from 'rxjs';
import { Department } from 'src/app/interfaces/department';
import { MapService } from 'src/app/services/map.service';
import { TuiAlertService } from '@taiga-ui/core';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.less'],
})
export class DepartmentListComponent implements OnInit {
  @Input()
  departmentList: Department[] | null = [];

  public isOpen = false;

  currentDepartment = new BehaviorSubject<Department | false>(false);

  constructor(
    private readonly mapService: MapService,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService
  ) {}
  ngOnInit(): void {
    this.mapService.currentOpenDepartment.pipe(skip(1)).subscribe((p) => {
      if (this.departmentList) {
        this.currentDepartment.next(
          this.departmentList.filter((i) => i.officePoint.lat === p.lat)[0]
        );
        console.log(this.departmentList[0]);
      }
      this.isOpen = true;
    });
  }

  selectDepartment(department: Department) {
    this.mapService.setView(department.officePoint);
    console.log(department);
    this.currentDepartment.next(department);
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  setPath() {
    const from = this.mapService.userCoordinates.getValue();
    if (from.lat > 0) {
      console.log(from);
    } else {
      this.alerts
        .open('Введите свой адрес, чтобы проложить маршрут', {
          status: 'warning',
        })
        .subscribe();
    }
  }
}
