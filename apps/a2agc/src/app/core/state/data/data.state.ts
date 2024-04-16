import { Injectable } from '@angular/core';
import { StateRepository } from '@angular-ru/ngxs/decorators';
import { NgxsImmutableDataRepository } from '@angular-ru/ngxs/repositories';
import { State } from '@ngxs/store';

import { DATA_CONFIG } from '../../../../configs/config';
import { DatasetLoaderService, RawData } from '../../services/dataset-loader/dataset-loader.service';
import { DatasetVariablesState } from './dataset-variables.state';
import { DatasetsState } from './datasets.state';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';


export type DataStateModel = Record<string, never>;


/**
 * Data state, contains datasets state and dataset variables state
 */
@StateRepository()
@State<DataStateModel>({
  name: 'data',
  children: [
    DatasetsState,
    DatasetVariablesState
  ]
})
@Injectable()
export class DataState extends NgxsImmutableDataRepository<DataStateModel> {
  /**
   * Creates an instance of data state.
   * @param datasetLoader dataset loader service
   * @param datasetsState datasets state
   * @param variablesState variables state
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

    this.datasetLoader.load(DATA_CONFIG.datasetsPath).subscribe(result => {
      this.datasetsState.addMany(result.datasets);
      this.variablesState.addMany(result.variables);
    });
  }


  isPrivate(): Observable<boolean> {
    const response = this.http.get<RawData>('adfhfushfdgfje', { responseType: 'json' });
    return response.pipe(
      catchError((this.handleError)),
      map(result => Object.keys(result).length > 0)
    );
  }

  private handleError(): Observable<boolean> {
    return of(false);
  }
}
