import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableDataSelectorComponent } from './table-data-selector.component';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    TableDataSelectorComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule
  ],
  exports: [ TableDataSelectorComponent ]
})
export class TableDataSelectorModule { }
