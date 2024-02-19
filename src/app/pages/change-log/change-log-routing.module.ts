import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeLogComponent } from './change-log.component';

const routes: Routes = [{ path: '', component: ChangeLogComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeLogRoutingModule { }
