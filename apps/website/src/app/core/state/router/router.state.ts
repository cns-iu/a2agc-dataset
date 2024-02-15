import { Injectable, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { StateRepository } from '@angular-ru/ngxs/decorators';
import { NgxsImmutableDataRepository } from '@angular-ru/ngxs/repositories';
import { RouterNavigation } from '@ngxs/router-plugin';
import { Actions, ofActionCompleted, State } from '@ngxs/store';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

@StateRepository()
@State({
  name: 'routerFacade',
})
@Injectable()
export class RouterState
  extends NgxsImmutableDataRepository<never>
  implements OnDestroy
{
  readonly destroy$ = new Subject<void>();

  readonly navigationStart$ = this.router.events.pipe(
    filter((ev): ev is NavigationStart => ev instanceof NavigationStart),
    map((ev) => ev.url),
    takeUntil(this.destroy$)
  );

  readonly navigationEnd$ = this.actions$.pipe(
    ofActionCompleted(RouterNavigation),
    map((ev) => (ev.action as RouterNavigation).event.url),
    takeUntil(this.destroy$)
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router
  ) {
    super();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
