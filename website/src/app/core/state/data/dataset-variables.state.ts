import { createEntityCollections, EntityCollections } from '@angular-ru/common/entity';
import { Injectable } from '@angular/core';
import { Computed, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataEntityCollectionsRepository } from '@ngxs-labs/data/repositories';
import { State } from '@ngxs/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, pluck, withLatestFrom } from 'rxjs/operators';

import { DATA_CONFIG } from '../../../../configs/config';
import { Dataset, DatasetMetaEntry, DatasetVariable } from '../../models/dataset.model';
import { DatasetsState } from './datasets.state';


export interface DatasetVariablesStateModel extends EntityCollections<DatasetVariable, string> {
  subLabel: string;
  subLabelFlag: string;
}


@StateRepository()
@State<DatasetVariablesStateModel>({
  name: 'datasetVariables',
  defaults: {
    ...createEntityCollections(),
    subLabel: DATA_CONFIG.subLabel,
    subLabelFlag: DATA_CONFIG.subLabelFlag
  }
})
@Injectable()
export class DatasetVariablesState extends NgxsDataEntityCollectionsRepository<DatasetVariable, string, DatasetVariablesStateModel> {
  @Computed()
  get subLabel$(): Observable<string> {
    return this.state$.pipe(pluck('subLabel'), distinctUntilChanged());
  }

  @Computed()
  get subLabelFlag$(): Observable<string> {
    return this.state$.pipe(pluck('subLabelFlag'), distinctUntilChanged());
  }

  constructor(private readonly datasetsState: DatasetsState) {
    super();
  }

  selectId(variable: DatasetVariable): string;
  selectId(dataset: string | Dataset, variable: string | DatasetVariable): string;
  selectId(
    dataset: string | Dataset | DatasetVariable,
    variable?: string | DatasetVariable
  ): string {
    if (typeof dataset === 'object' && 'dataset' in dataset) {
      variable = dataset;
      dataset = dataset.dataset;
    }

    const datasetId = this.datasetsState.selectId(dataset);
    const variableId = typeof variable === 'string' ? variable : variable!.name;
    return `${datasetId}:${variableId}`;
  }

  getVariable(key: string): Observable<DatasetVariable | undefined> {
    return this.entities$.pipe(pluck(key), distinctUntilChanged());
  }

  getVariables(dataset: string | Dataset): Observable<DatasetVariable[]> {
    const datasetId = this.datasetsState.selectId(dataset);

    return this.entitiesArray$.pipe(map(variables => {
      const belongsToDataset = (variable: DatasetVariable) =>
        this.datasetsState.selectId(variable.dataset) === datasetId;

      return variables.filter(belongsToDataset);
    }));
  }

  getSubVariables(dataset?: string | Dataset): Observable<DatasetVariable[]> {
    const datasetId = dataset && this.datasetsState.selectId(dataset);

    return this.entitiesArray$.pipe(
      withLatestFrom(this.subLabelFlag$),
      map(([variables, subLabelFlag]) => {
        const isSubVariable = (variable: DatasetVariable) =>
          variable.description === subLabelFlag &&
          (datasetId === undefined ||
            this.datasetsState.selectId(variable.dataset) === datasetId);

        return variables.filter(isSubVariable);
      })
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
}
