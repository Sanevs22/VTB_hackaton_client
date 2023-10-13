import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TUI_SANITIZER,
} from '@taiga-ui/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TuiDataListModule } from '@taiga-ui/core';
import {
  TuiIslandModule,
  TuiTagModule,
  TuiInputModule,
  TuiDataListWrapperModule,
  TuiMultiSelectModule,
  TuiCheckboxLabeledModule,
} from '@taiga-ui/kit';
import { TuiTableModule, TuiTableFiltersModule } from '@taiga-ui/addon-table';
import { ComponentsModule } from './components/components.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ComponentsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiIslandModule,
    TuiTableModule,
    TuiTagModule,
    TuiTableFiltersModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiMultiSelectModule,
    TuiCheckboxLabeledModule,
  ],
  exports: [],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }],
  bootstrap: [AppComponent],
})
export class AppModule {}
