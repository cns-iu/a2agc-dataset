import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxVegaModule } from 'ngx-vega';
import { DataDistributionsRoutingModule } from './data-distributions-routing.module';
import { DataDistributionsComponent } from './data-distributions.component';
import { TableDataSelectorModule } from '../../shared/components/table-data-selector/table-data-selector.module';
import { DatasetSummaryModule } from './../../shared/components/dataset-summary/dataset-summary.module';


@NgModule({
  declarations: [
    DataDistributionsComponent
  ],
  imports: [
    NgxVegaModule,
    CommonModule,
    DataDistributionsRoutingModule,
    TableDataSelectorModule,
    DatasetSummaryModule
  ]
})
export class DataDistributionsModule { }
