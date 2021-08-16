import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { Observable, ObservableInput, ReplaySubject } from 'rxjs';
import { switchAll } from 'rxjs/operators';
import { VisualizationSpec } from 'vega-embed';

import { Dataset, DatasetVariable } from '../../core/models/dataset.model';
import { DatasetVariablesState } from '../../core/state/data/dataset-variables.state';
import { DatasetsState } from '../../core/state/data/datasets.state';


export interface VariableData {
  dataset: string;
  name: string;
  variableName: string;
  type: string;
  description: string;
  missingValues: number;
  xLabel?: string;
  yLabel?: string;
}

export interface DistributionData {
  period?: string;
  value: string | number;
  count: number;
}

@Component({
  selector: 'agc-data-distributions',
  templateUrl: './data-distributions.component.html',
  styleUrls: ['./data-distributions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataDistributionsComponent {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'agc-data-distributions';

  readonly datasets$: Observable<Dataset[]>;
  readonly variables$: Observable<DatasetVariable[]>;
  readonly subLabel$: Observable<string>;
  readonly subVariables$: Observable<DatasetVariable[]>;

  selectedDataset?: Dataset;
  selectedVariable?: DatasetVariable;
  specs: VisualizationSpec[] = [];

  private readonly variableObservables$ = new ReplaySubject<ObservableInput<DatasetVariable[]>>(1);
  private readonly subVariableObservables$ = new ReplaySubject<ObservableInput<DatasetVariable[]>>(1);

  constructor(
    datasetsState: DatasetsState,
    private readonly variablesState: DatasetVariablesState
  ) {
    this.datasets$ = datasetsState.entitiesArray$;
    this.subLabel$ = variablesState.subLabel$;
    this.variables$ = this.variableObservables$.pipe(switchAll());
    this.subVariables$ = this.subVariableObservables$.pipe(switchAll());
  }

  setSelectedDataset(dataset: Dataset): void {
    if (dataset !== this.selectedDataset) {
      this.selectedDataset = dataset;
      this.selectedVariable = undefined;
      this.variableObservables$.next(this.variablesState.getVariables(dataset));
      this.subVariableObservables$.next(this.variablesState.getSubVariables(dataset));
    }
  }

  setSelectedVariable(variable: DatasetVariable): void {
    if (variable !== this.selectedVariable && this.selectedDataset !== undefined) {
      this.selectedVariable = variable;
    }
  }
}
