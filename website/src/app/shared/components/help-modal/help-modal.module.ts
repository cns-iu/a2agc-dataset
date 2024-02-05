import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpModalComponent } from './help-modal.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';



@NgModule({
  declarations: [HelpModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatExpansionModule
  ],
  exports: [HelpModalComponent]
})
export class HelpModalModule { }
