import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { NgxVegaModule } from 'ngx-vega';

import { Vis2OpioidTrajectoriesRoutingModule } from './vis2-opioid-trajectories-routing.module';
import { Vis2OpioidTrajectoriesComponent } from './vis2-opioid-trajectories.component';


@NgModule({
  declarations: [Vis2OpioidTrajectoriesComponent],
  imports: [
    CommonModule,
    Vis2OpioidTrajectoriesRoutingModule,
    MarkdownModule.forChild(),
    NgxVegaModule
  ]
})
export class Vis2OpioidTrajectoriesModule { }
