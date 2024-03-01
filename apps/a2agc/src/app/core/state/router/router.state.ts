import { Injectable, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { StateRepository } from '@angular-ru/ngxs/decorators';
import { NgxsImmutableDataRepository } from '@angular-ru/ngxs/repositories';
import { RouterNavigation } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, State } from '@ngxs/store';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';


/**
 * Manages routing state and provides observables for navigation start and end events
 */
@StateRepository()
@State({
  name: 'routerFacade'
})
@Injectable()
export class RouterState extends NgxsImmutableDataRepository<never> implements OnDestroy {
  /**
   * An RxJS Subject used to manage the component’s lifecycle. It emits a value when the component is destroyed.
   */
  readonly destroy$ = new Subject<void>();

  /**
   * An observable that listens for Angular router navigation start events. It filters out non-NavigationStart events, extracts the URL, and emits it.
   */
  readonly navigationStart$ = this.router.events.pipe(
    filter((ev): ev is NavigationStart => ev instanceof NavigationStart),
    map(ev => ev.url),
    takeUntil(this.destroy$)
  );

  /**
   *  An observable that listens for completed router navigation actions. It maps the event URL and emits it.
   */
  readonly navigationEnd$ = this.actions$.pipe(
    ofActionCompleted(RouterNavigation),
    map(ev => (ev.action as RouterNavigation).event.url),
    takeUntil(this.destroy$)
  );

  /**
   * Initializes the RouterState class.
   * @param actions$ provides access to dispatched actions in the Ngxs store
   * @param router router service
   */
  constructor(
    private readonly actions$: Actions,
    private readonly router: Router
  ) {
    super();
  }

  /**
   * Cleans up resources when the component is destroyed
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
