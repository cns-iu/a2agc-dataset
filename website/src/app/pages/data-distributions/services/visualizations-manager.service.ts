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


export interface BaseVisualizationEntry {
  variable: DatasetVariable;
  metadata: Observable<DatasetMetaEntry[]>;
}

export interface SpecVisualizationEntry extends BaseVisualizationEntry {
  spec: VisualizationSpec;
  data: Observable<DistributionDataEntry[]>;
}

export type DataFilter = [number, number] | undefined;
export type VisualizationEntry = BaseVisualizationEntry | SpecVisualizationEntry;


@Injectable()
export class VisualizationsManagerService {
  visualizations: VisualizationEntry[] = [];

  private readonly filterSources$ = new ReplaySubject<ObservableInput<DataFilter>>(1);

  constructor(
    private readonly chartFactory: ChartFactoryService,
    private readonly dataLoader: DistributionDataLoaderService,
    private readonly variableStore: DatasetVariablesState,
  ) {
    this.filterSources$.next(of(undefined));
  }

  setVariables(variables: DatasetVariable[]): void {
    this.visualizations = variables.map(variable => {
      const key = this.variableStore.selectId(variable);
      const metadata = this.variableStore.getMetadata(key);
      const spec = this.chartFactory.createChart(variable);
      const data = spec && this.createDataSource(variable);

      return { variable, metadata, spec, data };
    });
  }

  setFilterSource(source$: ObservableInput<DataFilter>): void {
    this.filterSources$.next(source$);
  }

  private createDataSource(variable: DatasetVariable): Observable<DistributionDataEntry[]> {
    const filter$ = this.filterSources$.pipe(switchAll(), startWith(undefined));
    const data$ = this.dataLoader.load(variable);
    const latest$ = combineLatest([data$, filter$]).pipe(throttleTime(100));
    return latest$.pipe(map(([data, filter]) => this.filterData(data, filter)));
  }

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
