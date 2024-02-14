import { Injectable } from '@angular/core';
import { Computed, DataAction, StateRepository } from '@angular-ru/ngxs/decorators';
import { NgxsImmutableDataRepository } from '@angular-ru/ngxs/repositories';
import { State } from '@ngxs/store';
import { Observable } from 'rxjs';
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
  @Computed()
  get hasShownHelpModal$(): Observable<boolean> {
    return this.state$.pipe(pluck('hasShownHelpModal'));
  }

  override ngxsOnInit(): void {
    super.ngxsOnInit();
    const hasShownHelpModal = localStorage.getItem(LOCAL_STORAGE_HELP_MODAL_KEY)?.toLowerCase() === 'true';
    this.patchState({ hasShownHelpModal });
  }

  @DataAction()
  setHasShownHelpModal(hasShownHelpModal: boolean): void {
    localStorage.setItem(LOCAL_STORAGE_HELP_MODAL_KEY, hasShownHelpModal.toString());
    this.ctx.patchState({ hasShownHelpModal });
  }
}
