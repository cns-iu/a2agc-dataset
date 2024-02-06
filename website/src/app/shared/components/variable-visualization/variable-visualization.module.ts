import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VegaComponent } from 'ngx-vega';

import { DatasetSummaryModule } from '../dataset-summary/dataset-summary.module';
import { VariableVisualizationComponent } from './variable-visualization.component';


@NgModule({
  imports: [
    CommonModule,

    VegaComponent,

    DatasetSummaryModule
  ],
  declarations: [VariableVisualizationComponent],
  exports: [VariableVisualizationComponent]
})
export class VariableVisualizationModule { }
