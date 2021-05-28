import { Injectable } from '@angular/core';
import { Computed, DataAction, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { State } from '@ngxs/store';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

interface PageStateModel {
  hasShownHelpModal: boolean;
}

@StateRepository()
@State<PageStateModel>({
  name: 'page',
  defaults: {
    hasShownHelpModal: false
  }
})
@Injectable()
export class PageState extends NgxsImmutableDataRepository<PageStateModel> {
  @Computed()
  get hasShownHelpModal$(): Observable<boolean> {
    return this.state$.pipe(pluck('hasShownHelpModal'));
  }

  @DataAction()
  setHasShownHelpModal(hasShownHelpModal: boolean): void {
    this.ctx.patchState({ hasShownHelpModal });
  }
}
