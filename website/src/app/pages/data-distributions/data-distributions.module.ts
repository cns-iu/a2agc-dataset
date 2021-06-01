import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataDistributionsRoutingModule } from './data-distributions-routing.module';
import { DataDistributionsComponent } from './data-distributions.component';
import { TableDataSelectorModule} from '../../shared/components/table-data-selector/table-data-selector.module';


@NgModule({
  declarations: [
    DataDistributionsComponent
  ],
  imports: [
    CommonModule,
    DataDistributionsRoutingModule,
    TableDataSelectorModule
  ]
})
export class DataDistributionsModule { }
