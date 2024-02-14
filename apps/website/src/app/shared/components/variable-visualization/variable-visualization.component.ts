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


const DEFAULT_FILTER_THROTTLE = 100;


@Component({
  selector: 'agc-variable-visualization',
  templateUrl: './variable-visualization.component.html',
  styleUrls: ['./variable-visualization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DataManagerService]
})
export class VariableVisualizationComponent implements OnChanges, OnDestroy {
  @Input() variable!: DatasetVariable;

  @Input() filterThrottle?: number;
  @Input() filterSource?: Observable<TimeFilter>;

  @Input() dataBindingName?: string;
  @Input() autosize: Autosize = false;
  @Input() options?: Options;

  loading = true;
  spec?: VisualizationSpec;
  metadata?: Observable<DatasetMetaEntry[]>;
  data: DistributionDataEntry[] = [];
  get isSummaryOnly(): boolean {
    return this.variable.distribution.type === DistributionType.summary;
  }

  private view?: View;

  private viewDataUpdateTaskId?: ReturnType<typeof setTimeout>;
  private readonly subscriptions = new Subscription();

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

  ngOnChanges(changes: SimpleChanges): void {
    if ('variable' in changes) {
      this.onVariableChange();
    }

    if ('filterThrottle' in changes || 'filterSource' in changes) {
      this.onFilterChange();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  attachView(view: View): void {
    this.view = view;
    this.scheduleViewDataUpdate();
  }

  resetView(): void {
    this.loading = true;
    this.spec = undefined;
    this.metadata = undefined;
    this.data = [];
    this.view = undefined;
  }

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

  private onFilterChange(): void {
    const { filterSource, filterThrottle = DEFAULT_FILTER_THROTTLE, dataManager } = this;
    const source$ = filterSource?.pipe?.(throttleTime(filterThrottle));
    dataManager.setFilterSource(source$);
  }

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

  private clearViewDataUpdate(): void {
    const id = this.viewDataUpdateTaskId;
    if (id !== undefined) {
      clearTimeout(id);
      this.viewDataUpdateTaskId = undefined;
    }
  }

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
