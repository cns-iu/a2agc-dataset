import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableDataSelectorComponent } from './table-data-selector.component';
import { MatSelectModule } from '@angular/material/select';
import { SubSelectorModule } from './../sub-selector/sub-selector.module';


@NgModule({
  declarations: [
    TableDataSelectorComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    SubSelectorModule
  ],
  exports: [ TableDataSelectorComponent ]
})
export class TableDataSelectorModule { }
