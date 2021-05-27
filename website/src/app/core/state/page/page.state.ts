import { Injectable } from '@angular/core';
import { DataAction, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { State } from '@ngxs/store';
import { pluck } from 'rxjs/operators';

interface PageStateModel {
  hasShownHelpModal: boolean;
}

const LOCAL_STORAGE_HELP_MODAL_KEY = 'HELP_POPUP_SHOWN';

@StateRepository()
@State<PageStateModel>({
  name: 'page',
  defaults: {
    hasShownHelpModal: false
  }
})
@Injectable()
export class PageState extends NgxsImmutableDataRepository<PageStateModel> {
  readonly hasShownHelpModal$ = this.state$.pipe(pluck('hasShownHelpModal'));

  ngxsOnInit(): void {
    super.ngxsOnInit();
    this.patchState({
      hasShownHelpModal: localStorage.getItem(LOCAL_STORAGE_HELP_MODAL_KEY)?.toLowerCase() === 'true' ? true : false
    });
  }

  @DataAction()
  setHasShownHelpModal(hasShownHelpModal: boolean): void {
    localStorage.setItem(LOCAL_STORAGE_HELP_MODAL_KEY, hasShownHelpModal.toString());
    this.ctx.patchState({ hasShownHelpModal });
  }
}
