import { Injectable } from '@angular/core';
import { StateRepository } from '@angular-ru/ngxs/decorators';
import { NgxsDataEntityCollectionsRepository } from '@angular-ru/ngxs/repositories';
import { State } from '@ngxs/store';

import { Visualization, visualizations } from './visualizations';


/**
 * Visualizations state service
 */
@StateRepository()
@State({
  name: 'visualizations'
})
@Injectable()
export class VisualizationsState extends NgxsDataEntityCollectionsRepository<Visualization, string>{
  /**
   * Sets all visualization entities
   */
  ngxsOnInit(): void {
    this.setAll(visualizations);
  }
}
