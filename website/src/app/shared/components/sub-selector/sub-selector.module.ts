import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubSelectorComponent } from './sub-selector.component';
import { MatSelectModule } from '@angular/material/select';



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
