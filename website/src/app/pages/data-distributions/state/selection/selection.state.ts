import { Injectable } from '@angular/core';
import { Computed, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { State } from '@ngxs/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';


interface SelectionStateModel {
  dataset: string | undefined;
  variable: string | undefined;
}


@StateRepository()
@State<SelectionStateModel>({
  name: 'dataDistributionSelection',
  defaults: {
    dataset: undefined,
    variable: undefined
  }
})
@Injectable()
export class SelectionState extends NgxsImmutableDataRepository<SelectionStateModel> {
  @Computed()
  get dataset(): Observable<string | undefined> {
    return this.state$.pipe(pluck('dataset'), distinctUntilChanged());
  }

  @Computed()
  get variable(): Observable<string | undefined> {
    return this.state$.pipe(pluck('variable'), distinctUntilChanged());
  }
}
