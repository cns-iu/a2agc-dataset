import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Dataset, DatasetVariable } from '../../models/dataset.model';


/* eslint-disable @typescript-eslint/naming-convention */

type RawData = Record<string, RawDataset>;

/**
 * Raw dataset info
 */
interface RawDataset {
  /** Dataset name */
  name: string;
  /** Description */
  remarks: string;
  /** Number of rows in dataset*/
  row_count: number;
  /** Record containing variable names and variable info */
  columns: Record<string, RawDatasetVariable>;
}

/**
 * Raw dataset variable info
 */
interface RawDatasetVariable {
  /** Variable name */
  name: string;
  /** Variable type */
  type: string;
  /** Description */
  remarks: string;
  /** Number of non-null values */
  n_non_null: number;
  /** % of missing values from total*/
  pct_missing: number;
  /** Distribution type */
  dist_type: string;
  /** Distribution data */
  dist_data: RawDistribution;
}

/**
 * Raw distribution info
 */
interface RawDistribution {
  /** Distinct values */
  distinct: number;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Url */
  url: string;
}

/* eslint-enable @typescript-eslint/naming-convention */

/**
 * Parse results interface
 */
export interface ParseResults {
  /** Parsed datasets */
  datasets: Dataset[];
  /** Parsed variables */
  variables: DatasetVariable[];
}


/**
 * Service to handle dataset loading
 */
@Injectable({
  providedIn: 'root'
})
export class DatasetLoaderService {
  /**
   * Creates an instance of dataset loader service.
   * @param http Angular http service
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Fetches data from url
   * @param url url
   * @returns observable of type parsed results
   */
  load(url: string): Observable<ParseResults> {
    const response = this.http.get<RawData>(url, { responseType: 'json' });
    return response.pipe(map(this.parseRawData.bind(this)));
  }

  /**
   * Processes the raw datasets and variable data received from the server.
   * @param data raw data
   * @returns parsed results
   */
  private parseRawData(data: RawData): ParseResults {
    const datasets: Dataset[] = [];
    const variables: DatasetVariable[] = [];

    for (const rawDataset of Object.values(data)) {
      datasets.push(this.parseRawDataset(rawDataset));
      variables.push(...Object.values(rawDataset.columns).map(
        rawVariable => this.parseRawDatasetVariable(rawDataset, rawVariable)
      ));
    }

    return { datasets, variables };
  }

  /**
   * Constructs a Dataset object from raw data
   * @param data raw data
   * @returns parsed dataset
   */
  private parseRawDataset(data: RawDataset): Dataset {
    return {
      name: data.name,
      description: data.remarks,
      variables: Object.keys(data.columns)
    };
  }

  /**
   * Constructs a DatasetVariable object from raw dataset and raw dataset variable
   * @param dataset raw dataset
   * @param data raw dataset variable
   * @returns parsed dataset variable
   */
  private parseRawDatasetVariable(dataset: RawDataset, data: RawDatasetVariable): DatasetVariable {
    return {
      dataset: dataset.name,
      name: data.name,
      description: data.remarks,
      type: data.type,
      nonNullCount: data.n_non_null,
      percentMissing: data.pct_missing,
      distribution: {
        type: data.dist_type,
        url: data.dist_data.url,
        summary: {
          distinct: data.dist_data.distinct,
          min: data.dist_data.min,
          max: data.dist_data.max
        }
      }
    };
  }
}
