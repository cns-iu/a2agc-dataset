import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxVegaModule } from 'ngx-vega';
import { DataDistributionsRoutingModule } from './data-distributions-routing.module';
import { DataDistributionsComponent } from './data-distributions.component';


@NgModule({
  declarations: [
    DataDistributionsComponent
  ],
  imports: [
    NgxVegaModule,
    CommonModule,
    DataDistributionsRoutingModule
  ]
})
export class DataDistributionsModule { }
