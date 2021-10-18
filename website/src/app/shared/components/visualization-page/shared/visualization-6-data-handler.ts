import { View } from 'vega';

import { DataHandler, DataHandlerType } from './data-handler';


type SignalValue<K extends PropertyKey, T> = Record<K, T | undefined>;

interface DataEntry {
  /* eslint-disable @typescript-eslint/naming-convention */
  CASE_NUMBER: string;
  RANK: number;
  AGE: number;
  PERIOD: number;
  TIME_BEFORE_DEATH: number;
  NUM_ENCOUNTERS_TOTAL: number;

  ALL_TYPES: number;
  HEALTH_ENCOUNTERS: number;
  OPIOID_PRESCRIPTIONS: number;
  INCARCERATIONS: number;
  OVERDOSES: number;
  /* eslint-enable @typescript-eslint/naming-convention */
}

export interface Visualization6DataHandlerOptions {
  maxCasesShown?: number;
}


export class Visualization6DataHandler implements DataHandler {
  static readonly OPTIONS: Visualization6DataHandlerOptions = {};

  static withOptions(options: Visualization6DataHandlerOptions): DataHandlerType {
    return class extends this {
      static readonly OPTIONS = options;
    };
  }

  readonly options = (this.constructor as typeof Visualization6DataHandler).OPTIONS;

  private data?: DataEntry[];
  private ranks?: number[];
  private ranksLookup?: Set<number>;
  private age?: [number, number];
  private numEncounters?: [number, number];

  private scheduledUpdateCall?: ReturnType<typeof setTimeout>;

  constructor(readonly view: View) {
    view.addDataListener('source', (_name, data: DataEntry[]) => {
      this.data = data;
      this.scheduleUpdateCall();
    });

    view.addSignalListener('rank', (_name, value: SignalValue<'RANK', number[]>) => {
      this.ranks = value.RANK;
      this.ranksLookup = undefined;
      this.scheduleUpdateCall();
    });

    view.addSignalListener('age', (_name, value: SignalValue<'AGE', [number, number]>) => {
      this.age = value.AGE;
      this.scheduleUpdateCall();
    });

    view.addSignalListener('encounters', (_name, value: SignalValue<'NUM_ENCOUNTERS', [number, number]>) => {
      this.numEncounters = value.NUM_ENCOUNTERS;
      this.scheduleUpdateCall();
    });
  }

  finalize(): void {
    this.clearScheduledUpdateCall();

    this.data = undefined;
    this.ranks = undefined;
    this.ranksLookup = undefined;
    this.age = undefined;
    this.numEncounters = undefined;
  }

  private scheduleUpdateCall(): void {
    this.clearScheduledUpdateCall();

    this.scheduledUpdateCall = setTimeout(async () => {
      this.clearScheduledUpdateCall();
      this.updateData();
      this.view.resize();
      await this.view.runAsync();
    }, 1000);
  }

  private clearScheduledUpdateCall(): void {
    if (this.scheduledUpdateCall !== undefined) {
      clearTimeout(this.scheduledUpdateCall);
      this.scheduledUpdateCall = undefined;
    }
  }

  private updateData(): void {
    let { data = [] } = this;

    data = this.filterByRank(data);
    data = this.filterByAge(data);
    data = this.filterByEncounters(data);

    data = this.limitData(data);

    this.view.data('processed_source', data);
  }

  private filterByRank(data: DataEntry[]): DataEntry[] {
    const { ranks } = this;
    if (ranks === undefined) {
      return data;
    }

    const lookup = (this.ranksLookup ??= new Set(ranks));
    return data.filter(({ RANK: value }) => lookup.has(value));
  }

  private filterByAge(data: DataEntry[]): DataEntry[] {
    const { age } = this;
    if (age === undefined) {
      return data;
    }

    const [min, max] = age;
    return data.filter(({ AGE: value }) => min <= value && value <= max);
  }

  private filterByEncounters(data: DataEntry[]): DataEntry[] {
    const { numEncounters } = this;
    if (numEncounters === undefined) {
      return data;
    }

    const [min, max] = numEncounters;
    return data.filter(({ NUM_ENCOUNTERS_TOTAL: value }) => min <= value && value <= max);
  }

  private limitData(data: DataEntry[]): DataEntry[] {
    const { options: { maxCasesShown = 25 } } = this;
    const selectedCases = new Set<string>();
    const result = [];

    for (const entry of data) {
      if (selectedCases.has(entry.CASE_NUMBER)) {
        result.push(entry);
      } else if (selectedCases.size < maxCasesShown) {
        result.push(entry);
        selectedCases.add(entry.CASE_NUMBER);
      }
    }

    return result;
  }
}
