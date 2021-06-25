import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatasetSummaryComponent } from './dataset-summary.component';



@NgModule({
  declarations: [
    DatasetSummaryComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [DatasetSummaryComponent]
})
export class DatasetSummaryModule { }
