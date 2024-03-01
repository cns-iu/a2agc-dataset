import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


/**
 * Component containing help dialog for visualizations
*/
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'agc-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss']
})
export class HelpModalComponent {
  /**
   * Creates an instance of help modal component.
   * @param dialogRef Help modal dialog reference
   */
  constructor(public dialogRef: MatDialogRef<HelpModalComponent>) { }

  /**
   * Closes help dialog
   */
  close(): void {
    this.dialogRef.close();
  }
}
