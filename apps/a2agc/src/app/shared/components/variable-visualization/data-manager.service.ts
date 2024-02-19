import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';

import { DatasetVariable } from '../../../core/models/dataset.model';
import { DistributionDataEntry } from '../../../core/models/distribution.model';
import {
  DistributionDataLoaderService,
} from '../../../core/services/distribution-data-loader/distribution-data-loader.service';


export type TimeFilter = [number, number] | undefined;


@Injectable()
export class DataManagerService implements OnDestroy {
  readonly data$: Observable<DistributionDataEntry[]>;

  private dataEmitter = new ReplaySubject<DistributionDataEntry[]>(1);
  private dataSub?: Subscription;
  private data: DistributionDataEntry[] = [];

  private get filteredData(): DistributionDataEntry[] {
    const filterPred = this.createFilterPred();
    return filterPred ? this.data.filter(filterPred) : this.data;
  }

  private get hasDataPeriods(): boolean {
    return this.data.some(({ period }) => !!period);
  }

  private filterSource?: Observable<TimeFilter>;
  private filterSub?: Subscription;
  private filter?: TimeFilter;

  constructor(private readonly loader: DistributionDataLoaderService) {
    this.data$ = this.dataEmitter.asObservable();
  }

  ngOnDestroy(): void {
    this.clearData();
    this.clearFilter();
  }

  load(variable: DatasetVariable): void {
    this.clearData();
    this.clearFilter();

    const data$ = this.loader.load(variable);
    this.dataSub = data$.subscribe(this.setData.bind(this));
  }

  setData(data: DistributionDataEntry[]): void {
    if (data === this.data) {
      return;
    }

    this.clearData();
    this.data = data;
    this.updateFiltering();
  }

  setFilterSource(source?: Observable<TimeFilter>): void {
    if (source === this.filterSource) {
      return;
    }

    this.clearFilter();
    this.filterSource = source;
    this.updateFiltering();
  }

  private createFilterPred(): ((entry: DistributionDataEntry) => boolean) | undefined {
    if (!this.filter) {
      return undefined;
    }

    const [start, end] = this.filter;
    return ({ period }) => !period || (start <= +period && +period <= end);
  }

  private updateFiltering(): void {
    if (this.filterSource) {
      if (!this.hasDataPeriods) {
        this.clearFilter();
      } else if (!this.filterSub) {
        let maybeSyncEmitted = false;
        this.filterSub = this.filterSource.subscribe(filter => {
          maybeSyncEmitted = true;
          this.filter = filter;
          this.emitData();
        });

        if (maybeSyncEmitted) {
          // If the subscribe callback was run synchronously
          // do not emit the data a second time
          return;
        }
      }
    }

    this.emitData();
  }

  private emitData(): void {
    this.dataEmitter.next(this.filteredData);
  }

  private clearData(): void {
    this.dataSub?.unsubscribe?.();
    this.data = [];
  }

  private clearFilter(): void {
    this.filterSub?.unsubscribe?.();
    this.filterSub = undefined;
    this.filter = undefined;
  }
}
