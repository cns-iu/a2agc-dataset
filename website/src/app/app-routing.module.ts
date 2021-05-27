import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutModule } from './pages/about/about.module';
import { ChangeLogModule } from './pages/change-log/change-log.module';
import { DataErDiagramModule } from './pages/data-er-diagram/data-er-diagram.module';
import { DataSchemaBrowserModule } from './pages/data-schema-browser/data-schema-browser.module';
import { VisualizationModule } from './pages/visualization/visualization.module';
import { DataDistributionsModule } from './pages/data-distributions/data-distributions.module';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'about' },
  { path: 'about', loadChildren: () => AboutModule },
  { path: 'change-log', loadChildren: () => ChangeLogModule },
  { path: 'data-er-diagram', loadChildren: () => DataErDiagramModule },
  { path: 'data-schema-browser', loadChildren: () => DataSchemaBrowserModule },
  { path: 'visualization/:id', loadChildren: () => VisualizationModule },
  { path: 'data-distributions', loadChildren: () =>  DataDistributionsModule }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
