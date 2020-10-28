import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'geomap',
    loadChildren: () => import('./pages/geomap/geomap.module').then(m => m.GeomapModule)
  },
  { path: 'vis1-geomap-of-opioid-deaths', loadChildren: () => import('./pages/vis1-geomap-of-opioid-deaths/vis1-geomap-of-opioid-deaths.module').then(m => m.Vis1GeomapOfOpioidDeathsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
