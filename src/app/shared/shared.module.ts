import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MarkdownModalModule } from './components/markdown-modal/markdown-modal.module';
import { MenuIconModule } from './components/menu-icon/menu-icon.module';
import { VariableVisualizationModule } from './components/variable-visualization/variable-visualization.module';
import { VisualizationPageModule } from './components/visualization-page/visualization-page.module';
import { OrderByPipe } from './pipes/order-by/order-by.pipe';


@NgModule({
  imports: [
    CommonModule,

    MarkdownModalModule,
    MenuIconModule,
    VariableVisualizationModule,
    VisualizationPageModule,
  ],
  declarations: [
    OrderByPipe
  ],
  exports: [
    MarkdownModalModule,
    MenuIconModule,
    VariableVisualizationModule,
    VisualizationPageModule,

    OrderByPipe
  ]
})
export class SharedModule { }
