import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataDistributionsComponent } from './data-distributions.component';

const routes: Routes = [{ path: '', component: DataDistributionsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataDistributionsRoutingModule { }
