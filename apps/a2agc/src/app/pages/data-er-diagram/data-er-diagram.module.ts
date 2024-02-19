import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataErDiagramRoutingModule } from './data-er-diagram-routing.module';
import { DataErDiagramComponent } from './data-er-diagram.component';


@NgModule({
  declarations: [DataErDiagramComponent],
  imports: [
    CommonModule,
    DataErDiagramRoutingModule
  ]
})
export class DataErDiagramModule { }
