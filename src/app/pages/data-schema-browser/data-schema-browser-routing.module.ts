import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataSchemaBrowserComponent } from './data-schema-browser.component';

const routes: Routes = [{ path: '', component: DataSchemaBrowserComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataSchemaBrowserRoutingModule { }
