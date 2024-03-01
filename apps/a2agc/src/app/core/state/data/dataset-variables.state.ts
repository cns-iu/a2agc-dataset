import { createEntityCollections, EntityCollections } from '@angular-ru/cdk/entity';
import { Injectable } from '@angular/core';
import { Computed, StateRepository } from '@angular-ru/ngxs/decorators';
import { NgxsDataEntityCollectionsRepository } from '@angular-ru/ngxs/repositories';
import { State } from '@ngxs/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';

import { DATA_CONFIG } from '../../../../configs/config';
import { Dataset, DatasetMetaEntry, DatasetVariable } from '../../models/dataset.model';
import { DatasetsState } from './datasets.state';


/**
 * Defines the shape of the state for managing dataset variables
 */
export interface DatasetVariablesStateModel extends EntityCollections<DatasetVariable, string> {
  /** Variable sublabel */
  subLabel: string;
  /** Sublabel flag */
  subLabelFlag: string;
}


export enum DatasetVariableGroup {
  all = 'all',
  sub = 'sub',
  nonSub = 'non-sub'
}


/**
 * Dataset variables state
 */
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
  /**
   * Observable returning subLabel property from state
   */
  @Computed()
  get subLabel$(): Observable<string> {
    return this.state$.pipe(pluck('subLabel'), distinctUntilChanged());
  }

  /**
   * Observable returning subLabelFlag property from state
   */
  @Computed()
  get subLabelFlag$(): Observable<string> {
    return this.state$.pipe(pluck('subLabelFlag'), distinctUntilChanged());
  }

  /**
   * Creates an instance of dataset variables state.
   * @param datasetsState datasets state
   */
  constructor(private readonly datasetsState: DatasetsState) {
    super();
  }

  /**
   * Selects id for a dataset variable
   * @param variable dataset variable
   * @returns id
   */
  selectId(variable: DatasetVariable): string;
  /**
   * Selects id for a dataset variable
   * @param dataset dataset, can be string or Dataset object
   * @param variable
   * @returns id
   */
  selectId(
    dataset: string | Dataset,
    variable: string | DatasetVariable
  ): string;
  /**
   * Selects id for a dataset variable
   * If first object is type of Dataset, assumes second argument is the variable
   * @param dataset dataset, can be string, Dataset or DatasetVariable
   * @param variable variable
   * @returns id
   */
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

  /**
   * Given a key (which is the variable ID), this method returns an observable of the corresponding DatasetVariable.
   * @param key variable id
   * @returns observable
   */
  getVariable(key: string): Observable<DatasetVariable | undefined> {
    return this.entities$.pipe(pluck(key), distinctUntilChanged());
  }

  /**
   * Retrieves an observable array of DatasetVariable from dataset and group
   * @param dataset dataset
   * @param group dataset variable group
   * @returns observable
   */
  getVariables(dataset?: string | Dataset, group?: DatasetVariableGroup): Observable<DatasetVariable[]> {
    const selector = this.createVariableSelector(dataset, group);
    return this.entitiesArray$.pipe(map(variables => variables.filter(selector)));
  }

  /**
   * Returns an observable array of DatasetVariable for data belonging to the sub group
   * @param dataset dataset
   * @returns observable
   */
  getSubVariables(dataset?: string | Dataset): Observable<DatasetVariable[]> {
    return this.getVariables(dataset, DatasetVariableGroup.sub);
  }

  /**
   * Returns an observable array of metadata entries based on a variable
   * @param key variable id
   * @returns observable
   */
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

  /**
   * Creates a selector function that filters dataset variable entities based on criteria
   * @param dataset dataset
   * @param group dataset variable group
   * @returns function
   */
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
