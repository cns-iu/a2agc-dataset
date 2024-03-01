import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges,
} from '@angular/core';
import { Autosize, Options } from 'ngx-vega';
import { Observable, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { View } from 'vega';
import { VisualizationSpec } from 'vega-embed';

import { DatasetMetaEntry, DatasetVariable } from '../../../core/models/dataset.model';
import { DistributionDataEntry, DistributionType } from '../../../core/models/distribution.model';
import { DatasetVariablesState } from '../../../core/state/data/dataset-variables.state';
import { ChartFactoryService } from '../../vega-charts/chart-factory.service';
import { DataManagerService, TimeFilter } from './data-manager.service';

export { TimeFilter };


/** Default filter throttle time (ms) */
const DEFAULT_FILTER_THROTTLE = 100;


/**
 * Data distributions variable visualization component
 */
@Component({
  selector: 'agc-variable-visualization',
  templateUrl: './variable-visualization.component.html',
  styleUrls: ['./variable-visualization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DataManagerService]
})
export class VariableVisualizationComponent implements OnChanges, OnDestroy {
  /** Dataset variable */
  @Input() variable!: DatasetVariable;

  /** Filter throttle time */
  @Input() filterThrottle?: number;
  /** Filter source observable */
  @Input() filterSource?: Observable<TimeFilter>;

  /** Name used for data binding */
  @Input() dataBindingName?: string;
  /** Whether autosizing is enabled */
  @Input() autosize: Autosize = false;
  /** Additional options for the visualization */
  @Input() options?: Options;

  /** Loading state */
  loading = true;
  /** Visualization spec */
  spec?: VisualizationSpec;
  /** Metadata observable */
  metadata?: Observable<DatasetMetaEntry[]>;
  /** Data for the distribution */
  data: DistributionDataEntry[] = [];
  /**
   * Checks if the data distribution type is summary only
   */
  get isSummaryOnly(): boolean {
    return this.variable.distribution.type === DistributionType.summary;
  }

  /** Visualization view */
  private view?: View;

  /** Task ID for updating the view data */
  private viewDataUpdateTaskId?: ReturnType<typeof setTimeout>;
  /** Subscriptions for the observables */
  private readonly subscriptions = new Subscription();

  /**
   * Creates an instance of variable visualization component.
   * @param cdr change detection
   * @param chartFactory creates chart
   * @param dataManager manages data
   * @param variableState variable state
   */
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly chartFactory: ChartFactoryService,
    private readonly dataManager: DataManagerService,
    private readonly variableState: DatasetVariablesState
  ) {
    const dataSub = dataManager.data$.subscribe(data => {
      this.data = data;
      this.scheduleViewDataUpdate();
    });

    this.subscriptions.add(dataSub);
    this.subscriptions.add(() => this.clearViewDataUpdate());
  }

  /**
   * Handles changes in variable and filter throttle time
   */
  ngOnChanges(changes: SimpleChanges): void {
    if ('variable' in changes) {
      this.onVariableChange();
    }

    if ('filterThrottle' in changes || 'filterSource' in changes) {
      this.onFilterChange();
    }
  }

  /**
   * Unsubscribes from subscriptions on component destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Sets view and schedules view data update
   * @param view view
   */
  attachView(view: View): void {
    this.view = view;
    this.scheduleViewDataUpdate();
  }

  /**
   * Resets view
   */
  resetView(): void {
    this.loading = true;
    this.spec = undefined;
    this.metadata = undefined;
    this.data = [];
    this.view = undefined;
  }

  /**
   * Resets view, loads new data and creates new chart on variable change
   */
  private onVariableChange(): void {
    this.resetView();

    const { variable, chartFactory, dataManager, variableState } = this;
    const vid = variableState.selectId(variable);
    const spec = this.spec = chartFactory.createChart(variable);
    this.metadata = variableState.getMetadata(vid);

    if (spec) {
      dataManager.load(variable);
    } else {
      dataManager.setData([]);
    }
  }

  /**
   * Sets filter source on filter change
   */
  private onFilterChange(): void {
    const { filterSource, filterThrottle = DEFAULT_FILTER_THROTTLE, dataManager } = this;
    const source$ = filterSource?.pipe?.(throttleTime(filterThrottle));
    dataManager.setFilterSource(source$);
  }

  /**
   * Schedules view data update
   */
  private scheduleViewDataUpdate(): void {
    if (this.viewDataUpdateTaskId !== undefined) {
      return;
    }

    const isCurrentTask = () => id === this.viewDataUpdateTaskId;
    const id = this.viewDataUpdateTaskId = setTimeout(async () => {
      if (!isCurrentTask() || !this.view) {
        return;
      }

      const bindingName = this.getDataBindingName();
      if (bindingName === undefined) {
        this.clearViewDataUpdate();
        return;
      }

      this.view.data(bindingName, this.data);
      await this.view.runAsync();

      if (isCurrentTask()) {
        this.loading = false;
        this.cdr.markForCheck();
        this.clearViewDataUpdate();
      }
    });
  }

  /**
   * Clear the timeout if the view data update task ID is not undefined
   */
  private clearViewDataUpdate(): void {
    const id = this.viewDataUpdateTaskId;
    if (id !== undefined) {
      clearTimeout(id);
      this.viewDataUpdateTaskId = undefined;
    }
  }

  /**
   * Gets data binding name
   * @returns data binding name
   */
  private getDataBindingName(): string | undefined {
    if (this.dataBindingName !== undefined) {
      return this.dataBindingName;
    }

    let guess: string | undefined;
    this.view?.getState({
      recurse: false,
      signals: () => false,
      data: name => {
        guess = name;
        return false;
      }
    });

    return guess;
  }
}
