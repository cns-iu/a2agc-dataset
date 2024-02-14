import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SubBarComponent } from './sub-bar.component';


@NgModule({
  imports: [CommonModule],
  declarations: [SubBarComponent],
  exports: [SubBarComponent]
})
export class SubBarModule { }
