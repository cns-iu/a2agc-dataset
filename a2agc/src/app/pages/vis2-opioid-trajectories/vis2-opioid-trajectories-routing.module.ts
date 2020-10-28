import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Vis2OpioidTrajectoriesComponent } from './vis2-opioid-trajectories.component';

const routes: Routes = [{ path: '', component: Vis2OpioidTrajectoriesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Vis2OpioidTrajectoriesRoutingModule { }
