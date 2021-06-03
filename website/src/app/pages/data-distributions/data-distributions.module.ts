import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisualizationPageModule } from '../../shared/components/visualization-page/visualization-page.module';
import { DataDistributionsRoutingModule } from './data-distributions-routing.module';
import { DataDistributionsComponent } from './data-distributions.component';


@NgModule({
  declarations: [
    DataDistributionsComponent
  ],
  imports: [
    CommonModule,
    DataDistributionsRoutingModule,
    VisualizationPageModule
  ]
})
export class DataDistributionsModule { }
