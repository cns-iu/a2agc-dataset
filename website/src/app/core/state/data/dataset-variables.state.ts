import { createEntityCollections, EntityCollections } from '@angular-ru/common/entity';
import { Injectable } from '@angular/core';
import { Computed, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataEntityCollectionsRepository } from '@ngxs-labs/data/repositories';
import { State } from '@ngxs/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';

import { DATA_CONFIG } from '../../../../configs/config';
import { Dataset, DatasetMetaEntry, DatasetVariable } from '../../models/dataset.model';
import { DatasetsState } from './datasets.state';


export interface DatasetVariablesStateModel extends EntityCollections<DatasetVariable, string> {
  subLabel: string;
  subLabelFlag: string;
}


export enum DatasetVariableGroup {
  all = 'all',
  sub = 'sub',
  nonSub = 'non-sub'
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

  getVariables(dataset?: string | Dataset, group?: DatasetVariableGroup): Observable<DatasetVariable[]> {
    const selector = this.createVariableSelector(dataset, group);
    return this.entitiesArray$.pipe(map(variables => variables.filter(selector)));
  }

  getSubVariables(dataset?: string | Dataset): Observable<DatasetVariable[]> {
    return this.getVariables(dataset, DatasetVariableGroup.sub);
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

  private createVariableSelector(
    dataset?: string | Dataset,
    group?: DatasetVariableGroup
  ): (variable: DatasetVariable) => boolean {
    type PredFn = (variable: DatasetVariable) => boolean;
    const predicates: PredFn[] = [];

    // Add dataset check
    if (dataset !== undefined) {
      const { datasetsState } = this;
      const selectDatasetId = datasetsState.selectId.bind(datasetsState);
      const id = selectDatasetId(dataset);
      predicates.push(variable => selectDatasetId(variable.dataset) === id);
    }

    // Add group check
    const { snapshot: { subLabelFlag } } = this;
    switch (group) {
      case DatasetVariableGroup.nonSub:
        predicates.push(variable => variable.description !== subLabelFlag);
        break;

      case DatasetVariableGroup.sub:
        predicates.push(variable => variable.description === subLabelFlag);
        break;

      default:
        break;
    }

    return predicates.length === 0 ?
      () => true :
      predicates.length === 1 ?
        predicates[0] :
        variable => predicates.every(pred => pred(variable));
  }
}
