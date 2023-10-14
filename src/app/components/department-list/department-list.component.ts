import { Component, Input } from '@angular/core';
import { Department } from 'src/app/interfaces/department';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.less'],
})
export class DepartmentListComponent {
  @Input()
  departmentList: Department[] | null = [];
}
