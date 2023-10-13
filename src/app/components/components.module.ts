import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { WidgetComponent } from './widget/widget.component';
import { TuiButtonModule } from '@taiga-ui/core';

@NgModule({
  declarations: [HeaderComponent, MapComponent, WidgetComponent],
  imports: [CommonModule, TuiButtonModule],
  exports: [HeaderComponent, MapComponent, WidgetComponent],
})
export class ComponentsModule {}
