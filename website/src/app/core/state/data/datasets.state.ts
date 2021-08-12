import { createEntityCollections, EntityCollections } from '@angular-ru/common/entity';
import { Injectable } from '@angular/core';
import { StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataEntityCollectionsRepository } from '@ngxs-labs/data/repositories';
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
  selectId(dataset: string | Dataset): string {
    return typeof dataset === 'string' ? dataset : dataset.name;
  }
}
