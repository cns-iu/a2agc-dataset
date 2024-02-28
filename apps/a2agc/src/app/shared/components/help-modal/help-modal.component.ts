import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


/**
 * Help modal component
*/
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'agc-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss']
})
export class HelpModalComponent {
  constructor(public dialogRef: MatDialogRef<HelpModalComponent>) { }

  close(): void {
    this.dialogRef.close();
  }
}
