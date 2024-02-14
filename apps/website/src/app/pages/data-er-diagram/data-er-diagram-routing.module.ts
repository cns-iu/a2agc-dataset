import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataErDiagramComponent } from './data-er-diagram.component';

const routes: Routes = [{ path: '', component: DataErDiagramComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataErDiagramRoutingModule { }
