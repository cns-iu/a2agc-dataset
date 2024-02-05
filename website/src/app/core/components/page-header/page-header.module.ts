import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';

import { SharedModule } from '../../../shared/shared.module';
import { PageHeaderComponent } from './page-header.component';


@NgModule({
  imports: [
    CommonModule,

    MatButtonModule,
    MatIconModule,

    SharedModule
  ],
  declarations: [PageHeaderComponent],
  exports: [PageHeaderComponent]
})
export class PageHeaderModule { }
