import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubSelectorComponent } from './sub-selector.component';



@NgModule({
  declarations: [
    SubSelectorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ SubSelectorComponent ]
})
export class SubSelectorModule { }
