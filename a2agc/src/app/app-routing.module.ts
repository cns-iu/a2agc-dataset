import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'geomap',
    loadChildren: () => import('./pages/geomap/geomap.module').then(m => m.GeomapModule)
  },
  { path: 'vis3-heatmap-of-accidental-overdoses', loadChildren: () => import('./pages/vis3-heatmap-of-accidental-overdoses/vis3-heatmap-of-accidental-overdoses.module').then(m => m.Vis3HeatmapOfAccidentalOverdosesModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
