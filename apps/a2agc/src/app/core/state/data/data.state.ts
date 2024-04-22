import { StateRepository } from '@angular-ru/ngxs/decorators';
import { NgxsImmutableDataRepository } from '@angular-ru/ngxs/repositories';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { catchError, map, Observable, of } from 'rxjs';

import { DATA_CONFIG } from '../../../../configs/config';
import { DatasetLoaderService, RawData } from '../../services/dataset-loader/dataset-loader.service';
import { DatasetVariablesState } from './dataset-variables.state';
import { DatasetsState } from './datasets.state';

export type DataStateModel = Record<string, never>;

/**
 * Data state, contains datasets state and dataset variables state
 */
@StateRepository()
@State<DataStateModel>({
  name: 'data',
  children: [DatasetsState, DatasetVariablesState],
})
@Injectable()
export class DataState extends NgxsImmutableDataRepository<DataStateModel> {
  /**
   * Creates an instance of data state.
   * @param datasetLoader dataset loader service
   * @param datasetsState datasets state
   * @param variablesState variables state
   * @param variablesState http service
   */
  constructor(
    private readonly datasetLoader: DatasetLoaderService,
    private readonly datasetsState: DatasetsState,
    private readonly variablesState: DatasetVariablesState,
    private readonly http: HttpClient
  ) {
    super();
  }

  /**
   * Loads datasets and variables on init
   */
  ngxsOnInit(): void {
    super.ngxsOnInit();

    this.datasetLoader.load(DATA_CONFIG.datasetsPath).subscribe((result) => {
      this.datasetsState.addMany(result.datasets);
      this.variablesState.addMany(result.variables);
    });
  }

  /**
   * Determines whether app is in private mode
   * Searches for aggregate-table-data.json in assets/generated
   * @returns true if the data config datasets path is valid, otherwise returns false
   */
  isPrivate(): Observable<boolean> {
    const response = this.http.get<RawData>(DATA_CONFIG.datasetsPath);
    return response.pipe(
      map((result) => this.isNotEmpty(result)),
      catchError(this.handleError)
    );
  }

  /**
   * Handles error when no response
   * @returns observable with false
   */
  private handleError(): Observable<boolean> {
    return of(false);
  }

  /**
   * Checks if object is not empty
   * @param input object
   * @returns true if not empty
   */
  private isNotEmpty(input: RawData): boolean {
    return Object.keys(input).length != 0;
  }
}
