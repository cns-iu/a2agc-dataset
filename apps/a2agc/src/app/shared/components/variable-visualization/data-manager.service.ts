import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';

import { DatasetVariable } from '../../../core/models/dataset.model';
import { DistributionDataEntry } from '../../../core/models/distribution.model';
import {
  DistributionDataLoaderService,
} from '../../../core/services/distribution-data-loader/distribution-data-loader.service';


export type TimeFilter = [number, number] | undefined;


/**
 * Service to manage data related to distribution and filtering.
 */
@Injectable()
export class DataManagerService implements OnDestroy {
  /** An observable emitting distribution data entries. */
  readonly data$: Observable<DistributionDataEntry[]>;

  /** Used to emit distribution data entries */
  private dataEmitter = new ReplaySubject<DistributionDataEntry[]>(1);
  /** Subscription to the data stream */
  private dataSub?: Subscription;
  /** Array of distribution data entries */
  private data: DistributionDataEntry[] = [];

  /**
   * Getter that applies a filter to the data if available
   */
  private get filteredData(): DistributionDataEntry[] {
    const filterPred = this.createFilterPred();
    return filterPred ? this.data.filter(filterPred) : this.data;
  }

  /**
   * Getter indicating whether data entries have a period property.
   */
  private get hasDataPeriods(): boolean {
    return this.data.some(({ period }) => !!period);
  }

  /** Observable source for time filters. */
  private filterSource?: Observable<TimeFilter>;
  /** Subscription to the filter source. */
  private filterSub?: Subscription;
  /** Time filter (range of numbers or undefined). */
  private filter?: TimeFilter;

  /**
   * Creates an instance of data manager service.
   * @param loader distribution data loader service
   */
  constructor(private readonly loader: DistributionDataLoaderService) {
    this.data$ = this.dataEmitter.asObservable();
  }

  /**
   * Cleans up resources when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.clearData();
    this.clearFilter();
  }

  /**
   * Loads data based on the provided dataset variable.
   * @param variable dataset variable
   */
  load(variable: DatasetVariable): void {
    this.clearData();
    this.clearFilter();

    const data$ = this.loader.load(variable);
    this.dataSub = data$.subscribe(this.setData.bind(this));
  }

  /**
   * Sets the data and updates filtering.
   * @param data distribution data
   */
  setData(data: DistributionDataEntry[]): void {
    if (data === this.data) {
      return;
    }

    this.clearData();
    this.data = data;
    this.updateFiltering();
  }

  /**
   * Sets the filter source and updates filtering.
   */
  setFilterSource(source?: Observable<TimeFilter>): void {
    if (source === this.filterSource) {
      return;
    }

    this.clearFilter();
    this.filterSource = source;
    this.updateFiltering();
  }

  /**
   * Creates a filter predicate function based on the current time filter (if any).
   * @returns predicate function
   */
  private createFilterPred(): ((entry: DistributionDataEntry) => boolean) | undefined {
    if (!this.filter) {
      return undefined;
    }

    const [start, end] = this.filter;
    return ({ period }) => !period || (start <= +period && +period <= end);
  }

  /**
   * Updates the data filtering based on the filter source (if available) and the presence of data periods.
   * @returns filtering
   */
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

  /**
   * Emits the filtered data using the dataEmitter.
   */
  private emitData(): void {
    this.dataEmitter.next(this.filteredData);
  }

  /**
   * Unsubscribes from the data subscription (dataSub) and clears the data array.
   */
  private clearData(): void {
    this.dataSub?.unsubscribe?.();
    this.data = [];
  }

  /**
   * Unsubscribes from the filter subscription (filterSub) and resets the filter.
   */
  private clearFilter(): void {
    this.filterSub?.unsubscribe?.();
    this.filterSub = undefined;
    this.filter = undefined;
  }
}
