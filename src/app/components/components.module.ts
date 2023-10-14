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

@NgModule({
  declarations: [HeaderComponent, MapComponent, WidgetComponent],
  imports: [
    CommonModule,
    TuiButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiSvgModule,
  ],
  exports: [HeaderComponent, MapComponent, WidgetComponent],
})
export class ComponentsModule {}
