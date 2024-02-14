import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

import { ChangeLogRoutingModule } from './change-log-routing.module';
import { ChangeLogComponent } from './change-log.component';


@NgModule({
  declarations: [ChangeLogComponent],
  imports: [
    CommonModule,
    ChangeLogRoutingModule,
    MarkdownModule.forChild()
  ]
})
export class ChangeLogModule { }
