import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubSelectorComponent } from './sub-selector.component';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';



@NgModule({
  declarations: [
    SubSelectorComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule
  ],
  exports: [ SubSelectorComponent ]
})
export class SubSelectorModule { }
