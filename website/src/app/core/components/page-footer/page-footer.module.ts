import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

import { PageFooterComponent } from './page-footer.component';


@NgModule({
  imports: [
    CommonModule,

    MatButtonModule
  ],
  declarations: [PageFooterComponent],
  exports: [PageFooterComponent],
})
export class PageFooterModule { }
