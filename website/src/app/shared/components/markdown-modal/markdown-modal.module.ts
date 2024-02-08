import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownModule } from 'ngx-markdown';

import { MarkdownModalComponent } from './markdown-modal.component';


@NgModule({
  imports: [
    CommonModule,

    MatButtonModule,
    MatDialogModule,
    MatIconModule,

    MarkdownModule
  ],
  declarations: [MarkdownModalComponent],
  exports: [MarkdownModalComponent]
})
export class MarkdownModalModule { }
