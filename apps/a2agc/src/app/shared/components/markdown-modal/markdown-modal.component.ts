import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


/**
 * Markdown modal data
 */
export interface MarkdownModalData {
  /** Markdown title */
  title: string;
  /** Path to markdown file */
  src: string;
}

/**
 * Markdown modal component
 */
@Component({
  selector: 'agc-markdown-modal',
  templateUrl: './markdown-modal.component.html',
  styleUrls: ['./markdown-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownModalComponent {
  /**
   * Creates an instance of markdown modal component and injects markdown data
   * @param data markdown modal data
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: MarkdownModalData
  ) { }
}
