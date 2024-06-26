import { Injectable } from '@angular/core';
import { Computed, DataAction, StateRepository } from '@angular-ru/ngxs/decorators';
import { NgxsImmutableDataRepository } from '@angular-ru/ngxs/repositories';
import { State } from '@ngxs/store';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

/**
 * Page state model
 */
interface PageStateModel {
  /** True if help modal has been shown on the page */
  hasShownHelpModal: boolean;
}

/** Local storage key for help popup shown */
const LOCAL_STORAGE_HELP_MODAL_KEY = 'HELP_POPUP_SHOWN';

/**
 * Page state
 */
@StateRepository()
@State<PageStateModel>({
  name: 'page',
  defaults: {
    hasShownHelpModal: false
  }
})
@Injectable()
export class PageState extends NgxsImmutableDataRepository<PageStateModel> {
  /**
   * Returns observable with help modal shown state
   */
  @Computed()
  get hasShownHelpModal$(): Observable<boolean> {
    return this.state$.pipe(pluck('hasShownHelpModal'));
  }

  /**
   * Sets hasShownHelpModal from local storage
   */
  ngxsOnInit(): void {
    super.ngxsOnInit();
    const hasShownHelpModal = localStorage.getItem(LOCAL_STORAGE_HELP_MODAL_KEY)?.toLowerCase() === 'true';
    this.patchState({ hasShownHelpModal });
  }

  /**
   * Sets hasShownHelpModal to value
   * @param hasShownHelpModal boolean value
   */
  @DataAction()
  setHasShownHelpModal(hasShownHelpModal: boolean): void {
    localStorage.setItem(LOCAL_STORAGE_HELP_MODAL_KEY, hasShownHelpModal.toString());
    this.ctx.patchState({ hasShownHelpModal });
  }
}
