import { createEntityCollections, EntityCollections } from '@angular-ru/cdk/entity';
import { Injectable } from '@angular/core';
import { StateRepository } from '@angular-ru/ngxs/decorators';
import { NgxsDataEntityCollectionsRepository } from '@angular-ru/ngxs/repositories';
import { State } from '@ngxs/store';

import { Dataset } from '../../models/dataset.model';


export type DatasetsStateModel = EntityCollections<Dataset, string>;


@StateRepository()
@State<DatasetsStateModel>({
  name: 'datasets',
  defaults: createEntityCollections()
})
@Injectable()
export class DatasetsState extends NgxsDataEntityCollectionsRepository<Dataset, string> {
  override selectId(dataset: string | Dataset): string {
    return typeof dataset === 'string' ? dataset : dataset.name;
  }
}
