import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
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
