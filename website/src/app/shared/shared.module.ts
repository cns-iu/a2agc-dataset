import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LazyVisualizationModule } from './components/lazy-visualization/lazy-visualization.module';
import { MarkdownModalModule } from './components/markdown-modal/markdown-modal.module';
import { MenuIconModule } from './components/menu-icon/menu-icon.module';
import { VisualizationPageModule } from './components/visualization-page/visualization-page.module';
import { OrderByPipe } from './pipes/order-by/order-by.pipe';


@NgModule({
  imports: [
    CommonModule,

    LazyVisualizationModule,
    MarkdownModalModule,
    MenuIconModule,
    VisualizationPageModule,
  ],
  declarations: [
    OrderByPipe
  ],
  exports: [
    LazyVisualizationModule,
    MarkdownModalModule,
    MenuIconModule,
    VisualizationPageModule,

    OrderByPipe
  ]
})
export class SharedModule { }
