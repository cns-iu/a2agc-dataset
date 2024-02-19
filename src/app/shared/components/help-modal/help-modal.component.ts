import { AfterViewInit, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'agc-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss']
})
export class HelpModalComponent implements AfterViewInit {
  // Workaround for angular component issue #13870
  disableAnimation = true;

  constructor(public dialogRef: MatDialogRef<HelpModalComponent>) { }

  ngAfterViewInit(): void {
    // timeout required to avoid 'ExpressionChangedAfterItHasBeenCheckedError'
    setTimeout(() => {
      this.disableAnimation = false;
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
