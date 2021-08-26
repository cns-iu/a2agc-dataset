import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { Autosize } from 'ngx-vega';
import { fromEventPattern, Observable, ObservableInput, ReplaySubject } from 'rxjs';
import { filter as filterOp, map, switchAll, switchMap, take } from 'rxjs/operators';
import { View } from 'vega';
import { VisualizationSpec } from 'vega-embed';

import { DATA_CONFIG } from '../../../configs/config';
import { Dataset, DatasetVariable } from '../../core/models/dataset.model';
import {
  DistributionDataLoaderService,
} from '../../core/services/distribution-data-loader/distribution-data-loader.service';
import { DatasetVariableGroup, DatasetVariablesState } from '../../core/state/data/dataset-variables.state';
import { DatasetsState } from '../../core/state/data/datasets.state';
import { ChartFactoryService } from '../../shared/vega-charts/chart-factory.service';
import {
  DataFilter, SpecVisualizationEntry, VisualizationEntry, VisualizationsManagerService,
} from './services/visualizations-manager.service';


@Component({
  selector: 'agc-data-distributions',
  templateUrl: './data-distributions.component.html',
  styleUrls: ['./data-distributions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [VisualizationsManagerService]
})
export class DataDistributionsComponent {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'agc-data-distributions';

  readonly autosize: Autosize = { width: true, height: false };

  readonly datasets$: Observable<Dataset[]>;
  readonly variables$: Observable<DatasetVariable[]>;
  readonly subLabel$: Observable<string>;
  readonly subVariables$: Observable<DatasetVariable[]>;

  selectedDataset?: Dataset;
  selectedVariable?: DatasetVariable;
  timeSliderSpec?: VisualizationSpec;

  get visualizations(): VisualizationEntry[] {
    return this.visManager.visualizations;
  }

  get showTimeSlider(): boolean {
    return this.timeSliderSpec !== undefined &&
      this.visualizations.some(this.hasSpec);
  }

  private readonly variableObservables$ = new ReplaySubject<ObservableInput<DatasetVariable[]>>(1);
  private readonly subVariableObservables$ = new ReplaySubject<ObservableInput<DatasetVariable[]>>(1);

  constructor(
    datasetsState: DatasetsState,
    private readonly variablesState: DatasetVariablesState,
    private readonly dataLoaderService: DistributionDataLoaderService,
    private readonly chartFactoryService: ChartFactoryService,
    private readonly visManager: VisualizationsManagerService
  ) {
    this.datasets$ = datasetsState.entitiesArray$;
    this.subLabel$ = variablesState.subLabel$;
    this.variables$ = this.variableObservables$.pipe(switchAll());
    this.subVariables$ = this.subVariableObservables$.pipe(switchAll());

    this.createTimeSliderVisualization();
  }

  hasSpec(this: void, entry: VisualizationEntry): entry is SpecVisualizationEntry {
    return 'spec' in entry && entry.spec !== undefined;
  }

  setSelectedDataset(dataset: Dataset): void {
    if (dataset !== this.selectedDataset) {
      this.selectedDataset = dataset;
      this.selectedVariable = undefined;
      this.variableObservables$.next(this.variablesState.getVariables(dataset, DatasetVariableGroup.nonSub));
      this.subVariableObservables$.next(this.variablesState.getSubVariables(dataset));
    }
  }

  setSelectedVariable(variable: DatasetVariable): void {
    if (variable !== this.selectedVariable && this.selectedDataset !== undefined) {
      this.selectedVariable = variable;
      this.visManager.setVariables([variable]);
    }
  }

  setSelectAllVariables(): void {
    const { selectedDataset } = this;
    if (selectedDataset !== undefined) {
      const variables = this.variablesState.entitiesArray.filter(
        variable => variable.dataset === selectedDataset.name
      );

      this.selectedVariable = undefined;
      this.visManager.setVariables(variables);
    }
  }

  attachPeriodSelector(view: View): void {
    const events$ = fromEventPattern<[string, { period: DataFilter }]>(
      handler => view.addSignalListener('period', handler),
      handler => view.removeSignalListener('period', handler)
    );
    const source$ = events$.pipe(map(([_name, { period }]) => period));

    this.visManager.setFilterSource(source$);
  }

  private createTimeSliderVisualization(): void {
    const variableId = this.variablesState.selectId(...DATA_CONFIG.timeSliderSource);
    const data$ = this.variablesState.getVariable(variableId).pipe(
      filterOp((variable): variable is DatasetVariable => variable !== undefined),
      switchMap(variable => this.dataLoaderService.load(variable)),
      take(1)
    );

    data$.subscribe(data => {
      this.timeSliderSpec = this.chartFactoryService.createTimeSlider(data);
    });
  }
}
