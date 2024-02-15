import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MarkdownModule } from 'ngx-markdown';
import { VegaComponent } from 'ngx-vega';

import { HelpModalModule } from '../help-modal/help-modal.module';
import { HelpTourModalModule } from '../help-tour-modal/help-tour-modal.module';
import { VisualizationPageComponent } from './visualization-page.component';

@NgModule({
  imports: [
    CommonModule,

    MatButtonModule,
    MatExpansionModule,
    MatIconModule,

    MarkdownModule.forChild(),
    VegaComponent,
    HelpModalModule,
    HelpTourModalModule,
    MatProgressSpinnerModule,
  ],
  declarations: [VisualizationPageComponent],
  exports: [VisualizationPageComponent],
})
export class VisualizationPageModule {}
