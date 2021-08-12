import { createEntityCollections, EntityCollections } from '@angular-ru/common/entity';
import { Injectable } from '@angular/core';
import { StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataEntityCollectionsRepository } from '@ngxs-labs/data/repositories';
import { State } from '@ngxs/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { Dataset, DatasetMetaEntry, DatasetVariable } from '../../models/dataset.model';


export type DatasetVariablesStateModel = EntityCollections<DatasetVariable, string>;


@StateRepository()
@State<DatasetVariablesStateModel>({
  name: 'datasetVariables',
  defaults: createEntityCollections()
})
@Injectable()
export class DatasetVariablesState extends NgxsDataEntityCollectionsRepository<DatasetVariable, string> {
  keyFor(variable: DatasetVariable): string;
  keyFor(dataset: string | Dataset, variable: string | DatasetVariable): string;
  keyFor(dataset: string | Dataset | DatasetVariable, variable?: string | DatasetVariable): string {
    if (typeof dataset === 'object' && 'dataset' in dataset) {
      return this.selectId(dataset);
    }

    const datasetId = typeof dataset === 'string' ? dataset : dataset.name;
    const variableId = typeof variable === 'string' ? variable : variable!.name;
    return this.keyForImpl(datasetId, variableId);
  }

  selectId(variable: DatasetVariable): string {
    return this.keyForImpl(variable.dataset, variable.name);
  }

  getVariable(key: string): Observable<DatasetVariable | undefined> {
    return this.entities$.pipe(
      map(entities => entities[key]),
      distinctUntilChanged()
    );
  }

  getMetadata(key: string): Observable<DatasetMetaEntry[]> {
    return this.getVariable(key).pipe(
      map(variable => {
        if (variable === undefined) {
          return [];
        }

        const meta: DatasetMetaEntry[] = [
          { label: 'Type', value: variable.type },
          { label: 'Description', value: variable.description },
          { label: 'Missing values', value: `${variable.percentMissing}%` }
        ];

        if (variable.distribution.type === 'summary') {
          const { distribution: { summary: { distinct, min, max } } } = variable;
          meta.push(
            { label: 'Distinct entries', value: '' + distinct },
            { label: 'Minimum value/length', value: '' + min },
            { label: 'Maximum value/length', value: '' + max }
          );
        }

        return meta;
      })
    );
  }

  private keyForImpl(datasetId: string, variableId: string): string {
    return `${datasetId}:${variableId}`;
  }
}
