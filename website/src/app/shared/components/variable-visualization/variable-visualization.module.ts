import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxVegaModule } from 'ngx-vega';

import { DatasetSummaryModule } from '../dataset-summary/dataset-summary.module';
import { VariableVisualizationComponent } from './variable-visualization.component';


@NgModule({
  imports: [
    CommonModule,

    NgxVegaModule,

    DatasetSummaryModule
  ],
  declarations: [VariableVisualizationComponent],
  exports: [VariableVisualizationComponent]
})
export class VariableVisualizationModule { }
