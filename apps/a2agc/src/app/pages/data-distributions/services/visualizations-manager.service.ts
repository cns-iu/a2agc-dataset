import { Injectable } from '@angular/core';
import { combineLatest, Observable, ObservableInput, of, ReplaySubject } from 'rxjs';
import { map, startWith, switchAll, throttleTime } from 'rxjs/operators';
import { VisualizationSpec } from 'vega-embed';

import { DatasetMetaEntry, DatasetVariable } from '../../../core/models/dataset.model';
import { DistributionDataEntry } from '../../../core/models/distribution.model';
import {
  DistributionDataLoaderService,
} from '../../../core/services/distribution-data-loader/distribution-data-loader.service';
import { DatasetVariablesState } from '../../../core/state/data/dataset-variables.state';
import { ChartFactoryService } from '../../../shared/vega-charts/chart-factory.service';


/**
 * Base visualization entry interface
 */
export interface BaseVisualizationEntry {
  /** Dataset variable */
  variable: DatasetVariable;
  /** Metadata observable */
  metadata: Observable<DatasetMetaEntry[]>;
}

/**
 * Spec visualization entry interface
 */
export interface SpecVisualizationEntry extends BaseVisualizationEntry {
  /** Vega lite spec */
  spec: VisualizationSpec;
  /** Dataset observable */
  data: Observable<DistributionDataEntry[]>;
}

export type DataFilter = [number, number] | undefined;
export type VisualizationEntry = BaseVisualizationEntry | SpecVisualizationEntry;


/**
 * Visualizations manager service
 */
@Injectable()
export class VisualizationsManagerService {
  /** All visualizations */
  visualizations: VisualizationEntry[] = [];

  /** Filter sources */
  private readonly filterSources$ = new ReplaySubject<ObservableInput<DataFilter>>(1);

  /**
   * Creates an instance of visualizations manager service.
   * @param chartFactory chart factory service
   * @param dataLoader distribution data loader service
   * @param variableStore dataset variables store
   */
  constructor(
    private readonly chartFactory: ChartFactoryService,
    private readonly dataLoader: DistributionDataLoaderService,
    private readonly variableStore: DatasetVariablesState,
  ) {
    this.filterSources$.next(of(undefined));
  }

  /**
   * Sets the visualizations property based on the provided dataset variables
   * @param variables dataset variables
   */
  setVariables(variables: DatasetVariable[]): void {
    this.visualizations = variables.map(variable => {
      const key = this.variableStore.selectId(variable);
      const metadata = this.variableStore.getMetadata(key);
      const spec = this.chartFactory.createChart(variable);
      const data = spec && this.createDataSource(variable);

      return { variable, metadata, spec, data };
    });
  }

  /**
   * Sets the filter source for data filtering.
   * @param source$ observable
   */
  setFilterSource(source$: ObservableInput<DataFilter>): void {
    this.filterSources$.next(source$);
  }

  /**
   * Creates a data source for a given variable by combining data and filter observables.
   * @param variable dataset variable
   * @returns observable
   */
  private createDataSource(variable: DatasetVariable): Observable<DistributionDataEntry[]> {
    const filter$ = this.filterSources$.pipe(switchAll(), startWith(undefined));
    const data$ = this.dataLoader.load(variable);
    const latest$ = combineLatest([data$, filter$]).pipe(throttleTime(100));
    return latest$.pipe(map(([data, filter]) => this.filterData(data, filter)));
  }

  /**
   * Filters data based on the specified time frame.
   * @param data dataset entries
   * @param filter time frame to filter
   * @returns data updated dataset entries
   */
  private filterData(data: DistributionDataEntry[], filter: DataFilter): DistributionDataEntry[] {
    if (filter === undefined) {
      return data;
    }

    const [min, max] = filter;
    const inTimeFrame = ({ period }: DistributionDataEntry) =>
      period === undefined || (min <= +period && +period <= max);

    return data.filter(inTimeFrame);
  }
}
