import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';
import { Autosize } from 'ngx-vega';
import { fromEventPattern, Observable, ObservableInput, ReplaySubject, Subscription, using } from 'rxjs';
import { filter, map, shareReplay, switchAll, switchMap, take } from 'rxjs/operators';
import { View } from 'vega';
import { VisualizationSpec } from 'vega-embed';

import { DATA_CONFIG } from '../../../configs/config';
import { Dataset, DatasetVariable } from '../../core/models/dataset.model';
import {
  DistributionDataLoaderService
} from '../../core/services/distribution-data-loader/distribution-data-loader.service';
import { DatasetVariableGroup, DatasetVariablesState } from '../../core/state/data/dataset-variables.state';
import { DatasetsState } from '../../core/state/data/datasets.state';
import { TimeFilter } from '../../shared/components/variable-visualization/data-manager.service';
import { ChartFactoryService } from '../../shared/vega-charts/chart-factory.service';
import { SpecVisualizationEntry, VisualizationEntry, VisualizationsManagerService } from './services/visualizations-manager.service';


/**
 * Component for data distributions page
 */
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

  /** Autosize config for visualization */
  readonly autosize: Autosize = { width: true, height: false };

  /** Datasets observable */
  readonly datasets$: Observable<Dataset[]>;
  /** Variables observable */
  readonly variables$: Observable<DatasetVariable[]>;
  /** Subselector label observable */
  readonly subLabel$: Observable<string>;
  /** Subvariables observable */
  readonly subVariables$: Observable<DatasetVariable[]>;

  /** Currently selected dataset */
  selectedDataset?: Dataset;
  /** Currently selected variables */
  selectedVariables: DatasetVariable[] = [];

  /** Visualization spec with filtered values */
  filterSpec?: VisualizationSpec;
  /** Time filter source observable */
  filterSource$: Observable<TimeFilter>;
  /** If filter is being applied */
  filterActive = false;
  /** Filter source observables */
  private readonly filterSourceObservables$ = new ReplaySubject<ObservableInput<TimeFilter>>(1);

  /** Variable observables */
  private readonly variableObservables$ = new ReplaySubject<ObservableInput<DatasetVariable[]>>(1);
  /** Subvariable observables */
  private readonly subVariableObservables$ = new ReplaySubject<ObservableInput<DatasetVariable[]>>(1);

  /**
   * Creates an instance of data distributions component.
   * @param datasetsState datasets state
   * @param variablesState dataset variables state
   * @param loader distribution data loader service
   * @param chartFactory chart factory service
   * @param cdr change detection
   */
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

  /**
   * Determines whether visualization entry has a spec property
   */
  hasSpec(this: void, entry: VisualizationEntry): entry is SpecVisualizationEntry {
    return 'spec' in entry && entry.spec !== undefined;
  }

  /**
   * Updates selected dataset
   * @param dataset selected dataset
   */
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

  /**
   * Updates selected variables
   * @param variable selected variable
   */
  setSelectedVariable(variable: DatasetVariable): void {
    const { selectedDataset, selectedVariables } = this;
    const alreadySelected = selectedVariables.length === 1 && selectedVariables[0] === variable;
    if (selectedDataset && !alreadySelected) {
      this.selectedVariables = [variable];
      this.filterActive = false;
    }
  }

  /**
   * Selects all variables in the list
   */
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

  /**
   * Attaches view filtered by period
   * @param view view
   */
  attachFilterView(view: View): void {
    const events$ = fromEventPattern<[string, { period: TimeFilter }]>(
      handler => view.addSignalListener('period', handler),
      handler => view.removeSignalListener('period', handler)
    );
    const source$ = events$.pipe(map(([_name, { period }]) => period));

    this.filterSourceObservables$.next(source$);
  }

  /**
   * Loads the time slider filter spec
   */
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

  /**
   * Creates a filter source observable
   */
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
