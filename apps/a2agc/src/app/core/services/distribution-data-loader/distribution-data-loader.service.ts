import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { parse, ParseConfig } from 'papaparse';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DatasetVariable } from '../../models/dataset.model';
import { DistributionDataEntry } from '../../models/distribution.model';


export type TransformHandlerFn = (value: string) => unknown;
export type TransformHandlers = Record<string | number, TransformHandlerFn | undefined>;


/**
 * Converts date strings to Date objects
 * @param value date string
 * @returns Date object
 */
function castDate(value: string): Date | undefined {
  const date = new Date(value);
  return Number.isNaN(+date) ? undefined : date;
}


/**
 * Service for fetching distribution data from a specified URL
 */
@Injectable({
  providedIn: 'root'
})
export class DistributionDataLoaderService {
  /**
   * Creates an instance of distribution data loader service.
   * @param http Angular http client
   */
  constructor(private readonly http: HttpClient) { }

  /**
   * Retrieves data based on the provided DatasetVariable
   * @param variable dataset variable
   * @returns observable with data
   */
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

  /**
   * Ensures that values are dynamically typed based on the presence of a value transformation.
   * @param variable dataset variable
   * @returns dynamic typing config
   */
  protected getDynamicTypingConfig(variable: DatasetVariable): ParseConfig['dynamicTyping'] {
    return {
      value: this.getValueTransform(variable) === undefined
    };
  }

  /**
   * Transforms variables to desired format
   * @param variable dataset variable
   * @returns transformed handlers
   */
  protected getTransformHandlers(variable: DatasetVariable): TransformHandlers {
    return {
      period: castDate,
      value: this.getValueTransform(variable),
      count: Number
    };
  }

  /**
   * Aggregates the distribution data based on the DatasetVariable type
   * If variable type is 'DATE' it groups data by year, otherwise it returns the original result
   * @param variable dataset variable
   * @param result data
   * @returns final aggregated result
   */
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

  /**
   * Determines the transformation function for the value field based on the variable type.
   * @param variable dataset variable
   * @returns value transform function
   */
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

  /**
   * Groups data by year for the DATE type.
   * @param data data with Date type
   * @returns aggregated data
   */
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
