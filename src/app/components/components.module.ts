import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { WidgetComponent } from './widget/widget.component';
import { TuiButtonModule } from '@taiga-ui/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiLoaderModule } from '@taiga-ui/core';
import { TuiDataListModule } from '@taiga-ui/core';
import { TuiComboBoxModule, TuiDataListWrapperModule } from '@taiga-ui/kit';
import { DepartmentListComponent } from './department-list/department-list.component';

@NgModule({
  declarations: [HeaderComponent, MapComponent, WidgetComponent, DepartmentListComponent],
  imports: [
    CommonModule,
    TuiButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiSvgModule,
    TuiDataListWrapperModule,
    TuiLoaderModule,
    TuiDataListModule,
    TuiComboBoxModule,
  ],
  exports: [HeaderComponent, MapComponent, WidgetComponent],
})
export class ComponentsModule {}
