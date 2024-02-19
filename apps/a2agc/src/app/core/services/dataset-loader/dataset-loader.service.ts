import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Dataset, DatasetVariable } from '../../models/dataset.model';


/* eslint-disable @typescript-eslint/naming-convention */

type RawData = Record<string, RawDataset>;

interface RawDataset {
  name: string;
  remarks: string;
  row_count: number;
  columns: Record<string, RawDatasetVariable>;
}

interface RawDatasetVariable {
  name: string;
  type: string;
  remarks: string;
  n_non_null: number;
  pct_missing: number;
  dist_type: string;
  dist_data: RawDistribution;
}

interface RawDistribution {
  distinct: number;
  min: number;
  max: number;
  url: string;
}

/* eslint-enable @typescript-eslint/naming-convention */

export interface ParseResults {
  datasets: Dataset[];
  variables: DatasetVariable[];
}


@Injectable({
  providedIn: 'root'
})
export class DatasetLoaderService {
  constructor(private readonly http: HttpClient) {}

  load(url: string): Observable<ParseResults> {
    const response = this.http.get<RawData>(url, { responseType: 'json' });
    return response.pipe(map(this.parseRawData.bind(this)));
  }

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

  private parseRawDataset(data: RawDataset): Dataset {
    return {
      name: data.name,
      description: data.remarks,
      variables: Object.keys(data.columns)
    };
  }

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
