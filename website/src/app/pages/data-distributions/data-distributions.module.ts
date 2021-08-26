import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxVegaModule } from 'ngx-vega';

import { DatasetSummaryModule } from '../../shared/components/dataset-summary/dataset-summary.module';
import { LazyVisualizationModule } from '../../shared/components/lazy-visualization/lazy-visualization.module';
import { TableDataSelectorModule } from '../../shared/components/table-data-selector/table-data-selector.module';
import { SharedModule } from '../../shared/shared.module';
import { DataDistributionsRoutingModule } from './data-distributions-routing.module';
import { DataDistributionsComponent } from './data-distributions.component';


@NgModule({
  imports: [
    CommonModule,

    MatButtonModule,

    NgxVegaModule,

    SharedModule,
    DatasetSummaryModule,
    LazyVisualizationModule,
    TableDataSelectorModule,

    DataDistributionsRoutingModule,
  ],
  declarations: [DataDistributionsComponent],
  exports: [DataDistributionsComponent]
})
export class DataDistributionsModule { }
