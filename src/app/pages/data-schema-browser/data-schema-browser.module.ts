import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataSchemaBrowserRoutingModule } from './data-schema-browser-routing.module';
import { DataSchemaBrowserComponent } from './data-schema-browser.component';


@NgModule({
  declarations: [DataSchemaBrowserComponent],
  imports: [
    CommonModule,
    DataSchemaBrowserRoutingModule
  ]
})
export class DataSchemaBrowserModule { }
