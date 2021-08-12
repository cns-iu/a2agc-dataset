import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxVegaModule } from 'ngx-vega';

import { LazyVisualizationComponent } from './lazy-visualization.component';


@NgModule({
  imports: [
    CommonModule,

    MatProgressSpinnerModule,

    NgxVegaModule
  ],
  declarations: [LazyVisualizationComponent],
  exports: [LazyVisualizationComponent]
})
export class LazyVisualizationModule { }
