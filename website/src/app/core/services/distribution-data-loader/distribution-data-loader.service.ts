import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { parse, ParseConfig } from 'papaparse';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DatasetVariable } from '../../models/dataset.model';
import { DistributionDataEntry } from '../../models/distribution.model';


@Injectable({
  providedIn: 'root'
})
export class DistributionDataLoaderService {
  constructor(private readonly http: HttpClient) { }

  load(variable: DatasetVariable): Observable<DistributionDataEntry[]> {
    const { distribution: { url } } = variable;
    const config: ParseConfig = {
      header: true,
      delimiter: ',',
      skipEmptyLines: true,
      dynamicTyping: {
        period: false,
        value: true,
        count: true
      }
    };

    return this.http.get(url, { responseType: 'text' }).pipe(
      map(text => parse<DistributionDataEntry>(text, config)),
      map(result => this.normalizeData(result.data, variable))
    );
  }

  private normalizeData(
    data: DistributionDataEntry[],
    variable: DatasetVariable
  ): DistributionDataEntry[] {
    switch (variable.type) {
      case 'BOOLEAN':
        return data.map(entry => ({
          ...entry,
          value: entry.value === 0 ? 'False' : 'True'
        }));

      default:
        return data;
    }
  }
}
