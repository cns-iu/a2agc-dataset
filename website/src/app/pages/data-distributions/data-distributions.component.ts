import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';
import { Autosize } from 'ngx-vega';
import { fromEventPattern, Observable, ObservableInput, ReplaySubject, Subscription, using } from 'rxjs';
import { filter, map, shareReplay, switchAll, switchMap, take } from 'rxjs/operators';
import { View } from 'vega';
import { VisualizationSpec } from 'vega-embed';

import { DATA_CONFIG } from '../../../configs/config';
import { Dataset, DatasetVariable } from '../../core/models/dataset.model';
import {
  DistributionDataLoaderService,
} from '../../core/services/distribution-data-loader/distribution-data-loader.service';
import { DatasetVariableGroup, DatasetVariablesState } from '../../core/state/data/dataset-variables.state';
import { DatasetsState } from '../../core/state/data/datasets.state';
import { TimeFilter } from '../../shared/components/variable-visualization/data-manager.service';
import { ChartFactoryService } from '../../shared/vega-charts/chart-factory.service';


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
  selectedVariables: DatasetVariable[] = [];

  filterSpec?: VisualizationSpec;
  filterSource$: Observable<TimeFilter>;
  filterActive = false;
  private readonly filterSourceObservables$ = new ReplaySubject<ObservableInput<TimeFilter>>(1);

  private readonly variableObservables$ = new ReplaySubject<ObservableInput<DatasetVariable[]>>(1);
  private readonly subVariableObservables$ = new ReplaySubject<ObservableInput<DatasetVariable[]>>(1);

  constructor(
    datasetsState: DatasetsState,
    private readonly variablesState: DatasetVariablesState,
    private readonly loader: DistributionDataLoaderService,
    private readonly chartFactory: ChartFactoryService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.datasets$ = datasetsState.entitiesArray$;
    this.subLabel$ = variablesState.subLabel$;
    this.variables$ = this.variableObservables$.pipe(switchAll());
    this.subVariables$ = this.subVariableObservables$.pipe(switchAll());

    this.loadFilterSpec();
    this.filterSource$ = this.createFilterSource();
  }

  setSelectedDataset(dataset: Dataset): void {
    if (dataset !== this.selectedDataset) {
      this.selectedDataset = dataset;
      this.selectedVariables = [];
      this.filterActive = false;

      const { variablesState, variableObservables$, subVariableObservables$ } = this;
      const variables$ = variablesState.getVariables(dataset, DatasetVariableGroup.nonSub);
      const subVariables$ = variablesState.getVariables(dataset, DatasetVariableGroup.sub);

      variableObservables$.next(variables$);
      subVariableObservables$.next(subVariables$);
    }
  }

  setSelectedVariable(variable: DatasetVariable): void {
    const { selectedDataset, selectedVariables } = this;
    const alreadySelected = selectedVariables.length === 1 && selectedVariables[0] === variable;
    if (selectedDataset && !alreadySelected) {
      this.selectedVariables = [variable];
      this.filterActive = false;
    }
  }

  setSelectAllVariables(): void {
    const { selectedDataset } = this;
    if (selectedDataset) {
      const variables = this.variablesState.entitiesArray.filter(
        variable => variable.dataset === selectedDataset.name
      );

      this.selectedVariables = variables;
      this.filterActive = true;
    }
  }

  attachFilterView(view: View): void {
    const events$ = fromEventPattern<[string, { period: TimeFilter }]>(
      handler => view.addSignalListener('period', handler),
      handler => view.removeSignalListener('period', handler)
    );
    const source$ = events$.pipe(map(([_name, { period }]) => period));

    this.filterSourceObservables$.next(source$);
  }

  private loadFilterSpec(): void {
    const { variablesState, loader, chartFactory, cdr } = this;
    const vid = variablesState.selectId(...DATA_CONFIG.timeSliderSource);
    const variable$ = variablesState.getVariable(vid);
    const data$ = variable$.pipe(
      filter(variable => !!variable),
      switchMap(variable => loader.load(variable!)),
      take(1)
    );

    data$.subscribe(data => {
      this.filterSpec = chartFactory.createTimeSlider(data);
      cdr.markForCheck();
    });
  }

  private createFilterSource(): Observable<TimeFilter> {
    const { filterSourceObservables$, cdr } = this;
    const sources$ = using(() => {
      this.filterActive = true;
      cdr.markForCheck();

      return new Subscription(() => {
        this.filterActive = false;
        cdr.markForCheck();
      });
    }, () => filterSourceObservables$);

    return sources$.pipe(shareReplay(1), switchAll());
  }
}
