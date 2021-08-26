import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { parse, ParseConfig } from 'papaparse';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DatasetVariable } from '../../models/dataset.model';
import { DistributionDataEntry } from '../../models/distribution.model';


export type TransformHandlerFn = (value: string) => unknown;
export type TransformHandlers = Record<string | number, TransformHandlerFn | undefined>;


function castDate(value: string): Date | undefined {
  const date = new Date(value);
  return Number.isNaN(+date) ? undefined : date;
}


@Injectable({
  providedIn: 'root'
})
export class DistributionDataLoaderService {
  constructor(private readonly http: HttpClient) { }

  load(variable: DatasetVariable): Observable<DistributionDataEntry[]> {
    const { distribution: { url } } = variable;
    const handlers = this.getTransformHandlers(variable);
    const config: ParseConfig = {
      header: true,
      delimiter: ',',
      skipEmptyLines: true,
      dynamicTyping: this.getDynamicTypingConfig(variable),
      transform: (value, field) => {
        const handler = handlers[field];
        return handler ? handler(value) : value;
      }
    };

    return this.http.get(url, { responseType: 'text' }).pipe(
      map(text => parse<DistributionDataEntry>(text, config)),
      map(result => this.aggregateResult(variable, result.data))
    );
  }

  protected getDynamicTypingConfig(variable: DatasetVariable): ParseConfig['dynamicTyping'] {
    return {
      value: this.getValueTransform(variable) === undefined
    };
  }

  protected getTransformHandlers(variable: DatasetVariable): TransformHandlers {
    return {
      period: castDate,
      value: this.getValueTransform(variable),
      count: Number
    };
  }

  protected aggregateResult(
    variable: DatasetVariable,
    result: DistributionDataEntry[]
  ): DistributionDataEntry[] {
    switch (variable.type) {
      case 'DATE':
        return this.aggregateByYear(result as DistributionDataEntry<Date | undefined>[]);

      default:
        return result;
    }
  }

  private getValueTransform(variable: DatasetVariable): TransformHandlerFn | undefined {
    switch (variable.type) {
      case 'BOOLEAN':
        return value => value === '0' ? 'False' : 'True';

      case 'DATE':
        return castDate;

      default:
        return undefined;
    }
  }

  private aggregateByYear(
    data: DistributionDataEntry<Date | undefined>[]
  ): DistributionDataEntry<Date | string>[] {
    const byYear = data.reduce((mapping, { value, count }) => {
      const key = value?.getFullYear?.();
      const newCount = (mapping.get(key) ?? 0) + count;
      return mapping.set(key, newCount);
    }, new Map<number | undefined, number>());

    const sortedYears = Array.from(byYear.keys()).sort((k1, k2) =>
      k1 === undefined ? 1 : k2 === undefined ? -1 : k1 - k2
    );

    const result = sortedYears.map<DistributionDataEntry<Date | string>>(year => {
      const period = year !== undefined ? new Date(year, 0) : undefined;
      const value = period ?? '<date unavailable>';
      return { period, value, count: byYear.get(year)! };
    });

    return result;
  }
}
