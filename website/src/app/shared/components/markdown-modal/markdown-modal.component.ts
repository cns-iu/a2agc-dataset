import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';


export interface MarkdownModalData {
  title: string;
  src: string;
}

@Component({
  selector: 'agc-markdown-modal',
  templateUrl: './markdown-modal.component.html',
  styleUrls: ['./markdown-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: MarkdownModalData
  ) { }
}
