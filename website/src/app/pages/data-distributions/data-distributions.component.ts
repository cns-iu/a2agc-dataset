import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { Autosize } from 'ngx-vega';
import { combineLatest, Observable, ObservableInput, ReplaySubject } from 'rxjs';
import { filter as filterOp, map, startWith, switchAll, switchMap, take, throttleTime } from 'rxjs/operators';
import { View } from 'vega';
import { VisualizationSpec } from 'vega-embed';

import { DATA_CONFIG } from '../../../configs/config';
import { Dataset, DatasetMetaEntry, DatasetVariable } from '../../core/models/dataset.model';
import { DistributionDataEntry } from '../../core/models/distribution.model';
import {
  DistributionDataLoaderService,
} from '../../core/services/distribution-data-loader/distribution-data-loader.service';
import { DatasetVariableGroup, DatasetVariablesState } from '../../core/state/data/dataset-variables.state';
import { DatasetsState } from '../../core/state/data/datasets.state';
import { ChartFactoryService } from '../../shared/vega-charts/chart-factory.service';


type Filter = [number, number] | undefined;

export interface VisualizationEntry {
  variable: DatasetVariable;
  spec: VisualizationSpec | undefined;
  data: Observable<DistributionDataEntry[]>;
  metadata: Observable<DatasetMetaEntry[]>;
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

  readonly autosize: Autosize = { width: true, height: false };

  readonly datasets$: Observable<Dataset[]>;
  readonly variables$: Observable<DatasetVariable[]>;
  readonly subLabel$: Observable<string>;
  readonly subVariables$: Observable<DatasetVariable[]>;

  selectedDataset?: Dataset;
  selectedVariable?: DatasetVariable;
  timeSliderSpec?: VisualizationSpec;
  visualizations: VisualizationEntry[] = [];

  private readonly variableObservables$ = new ReplaySubject<ObservableInput<DatasetVariable[]>>(1);
  private readonly subVariableObservables$ = new ReplaySubject<ObservableInput<DatasetVariable[]>>(1);

  private readonly filterObservable$ = new ReplaySubject<ObservableInput<Filter>>(1);
  private readonly filters$ = this.filterObservable$.pipe(switchAll());

  constructor(
    datasetsState: DatasetsState,
    private readonly variablesState: DatasetVariablesState,
    private readonly dataLoaderService: DistributionDataLoaderService,
    private readonly chartFactoryService: ChartFactoryService
  ) {
    this.datasets$ = datasetsState.entitiesArray$;
    this.subLabel$ = variablesState.subLabel$;
    this.variables$ = this.variableObservables$.pipe(switchAll());
    this.subVariables$ = this.subVariableObservables$.pipe(switchAll());

    this.createTimeSliderVisualization();
  }

  setSelectedDataset(dataset: Dataset): void {
    if (dataset !== this.selectedDataset) {
      this.selectedDataset = dataset;
      this.selectedVariable = undefined;
      this.visualizations = [];
      this.variableObservables$.next(this.variablesState.getVariables(dataset, DatasetVariableGroup.nonSub));
      this.subVariableObservables$.next(this.variablesState.getSubVariables(dataset));
    }
  }

  setSelectedVariable(variable: DatasetVariable): void {
    if (variable !== this.selectedVariable && this.selectedDataset !== undefined) {
      this.selectedVariable = variable;
      this.visualizations = [this.createVisualization(variable)];
    }
  }

  setSelectAllVariables(): void {
    const { selectedDataset } = this;
    if (selectedDataset !== undefined) {
      const variables$ = this.variablesState.getVariables(selectedDataset).pipe(take(1));
      variables$.subscribe(variables => {
        if (this.selectedDataset === selectedDataset) {
          this.visualizations = variables.map(v => this.createVisualization(v));
        }
      });
    }
  }

  attachPeriodSelector(view: View): void {
    const filters = new ReplaySubject<Filter>(1);
    const handler = (_name: string, value: { period: Filter }) => filters.next(value.period);

    view.addSignalListener('period', handler);
    this.filterObservable$.next(filters);
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

  private createVisualization(variable: DatasetVariable): VisualizationEntry {
    const variableId = this.variablesState.selectId(variable);
    const spec = this.chartFactoryService.createChart(variable);
    const data = combineLatest([
      this.dataLoaderService.load(variable),
      this.filters$.pipe(startWith(undefined))
    ]).pipe(
      throttleTime(100),
      map(args => this.filterData(...args))
    );
    const metadata = this.variablesState.getMetadata(variableId);

    return { variable, spec, data, metadata };
  }

  private filterData(data: DistributionDataEntry[], filter: Filter): DistributionDataEntry[] {
    if (filter === undefined) {
      return data;
    }

    return data.filter(({ period }: DistributionDataEntry) => {
      const millisecs = Date.parse(period);
      return period === '' || (filter[0] <= millisecs && millisecs <= filter[1]);
    });
  }
}
