import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxVegaModule } from 'ngx-vega';

import { TableDataSelectorModule } from '../../shared/components/table-data-selector/table-data-selector.module';
import { DatasetSummaryModule } from './../../shared/components/dataset-summary/dataset-summary.module';
import { DataDistributionsRoutingModule } from './data-distributions-routing.module';
import { DataDistributionsComponent } from './data-distributions.component';
import { StateModule } from './state/state.module';


@NgModule({
  imports: [
    CommonModule,

    NgxVegaModule,

    DatasetSummaryModule,
    TableDataSelectorModule,

    DataDistributionsRoutingModule,
    StateModule
  ],
  declarations: [DataDistributionsComponent],
  exports: [DataDistributionsComponent]
})
export class DataDistributionsModule { }
