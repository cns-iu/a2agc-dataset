import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpTourModalComponent } from './help-tour-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [HelpTourModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule
  ],
  exports: [HelpTourModalComponent]
})
export class HelpTourModalModule { }
