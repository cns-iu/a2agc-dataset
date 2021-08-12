import { NgModule, Type } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { SelectionState } from './selection/selection.state';


const FEATURE_STATES: Type<unknown>[] = [
  SelectionState
];


@NgModule({
  imports: [
    NgxsModule.forFeature(FEATURE_STATES),
  ]
})
export class StateModule { }
