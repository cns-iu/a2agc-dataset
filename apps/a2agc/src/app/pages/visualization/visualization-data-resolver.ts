import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { pluck, take } from 'rxjs/operators';
import { Visualization } from '../../core/state/visualizations/visualizations';

import { VisualizationsState } from '../../core/state/visualizations/visualizations.state';


/**
 * Visualization data resolver
 */
@Injectable({ providedIn: 'root' })
export class VisualizationDataResolver {
  /**
   * Creates an instance of visualization data resolver.
   * @param service visualizations state service
   */
  constructor(private readonly service: VisualizationsState) { }

  /**
   * Resolves routes and returns observable
   * @param route Route information
   * @returns observable
   */
  resolve(route: ActivatedRouteSnapshot): Observable<Visualization> {
    const id = route.paramMap.get('id');
    if (id === null) {
      return EMPTY;
    }

    return this.service.entities$.pipe(
      pluck(id),
      take(1)
    );
  }
}
