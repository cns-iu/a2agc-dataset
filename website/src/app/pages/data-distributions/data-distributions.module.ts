import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LazyVisualizationModule } from '../../shared/components/lazy-visualization/lazy-visualization.module';
import { TableDataSelectorModule } from '../../shared/components/table-data-selector/table-data-selector.module';
import { DataDistributionsRoutingModule } from './data-distributions-routing.module';
import { DataDistributionsComponent } from './data-distributions.component';


@NgModule({
  imports: [
    CommonModule,

    LazyVisualizationModule,
    TableDataSelectorModule,

    DataDistributionsRoutingModule,
  ],
  declarations: [DataDistributionsComponent],
  exports: [DataDistributionsComponent]
})
export class DataDistributionsModule { }
