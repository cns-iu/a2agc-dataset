/* eslint-disable @typescript-eslint/naming-convention */
import { View, ingest } from 'vega';

import { DataHandler, DataHandlerType } from './data-handler';


type SignalValue<K extends PropertyKey, T> = Record<K, T | undefined>;

type SortField = 'AGE_RANK' | 'HEALTH_RANK' | 'OVERDOSE_RANK' | 'TIME_FIRST_OD' | 'TIME_FIRST_RX' | 'OD_DIFF' | 'RX_DIFF' | 'INCARCERATIONS_RANK' | 'PRESCRIPTIONS_RANK';

interface DataEntry {
  CASE_NUMBER: string;
  RANK: number;
  AGE: number;
  PERIOD: number;
  TIME_BEFORE_DEATH: number;

  ALL_TYPES: number;
  HEALTH_ENCOUNTERS: number;
  OPIOID_PRESCRIPTIONS: number;
  INCARCERATIONS: number;
  OVERDOSES: number;
  NUM_ENCOUNTERS_TOTAL: number;

  AGE_RANK: number;
  HEALTH_RANK: number;
  OVERDOSE_RANK: number;
  INCARCERATIONS_RANK: number;
  PRESCRIPTIONS_RANK: number;
  FINAL_RANK: number;

  TIME_FIRST_OD: number;
  TIME_FIRST_RX: number;
  OD_DIFF: number;
  RX_DIFF: number;
}

export interface Visualization6DataHandlerOptions {
  debounceTime?: number;
  maxCasesShown?: number;
}


// Used when the resulting data is empty to prevent the visualization view from blowing up
const fakeEntries: DataEntry[] = [
  {
    CASE_NUMBER: '',
    RANK: 0,
    AGE: 0,
    PERIOD: 0,
    TIME_BEFORE_DEATH: 0,

    ALL_TYPES: 0,
    HEALTH_ENCOUNTERS: 0,
    OPIOID_PRESCRIPTIONS: 0,
    INCARCERATIONS: 0,
    OVERDOSES: 0,
    NUM_ENCOUNTERS_TOTAL: 0,

    AGE_RANK: 0,
    HEALTH_RANK: 0,
    OVERDOSE_RANK: 0,
    INCARCERATIONS_RANK: 0,
    PRESCRIPTIONS_RANK: 0,
    FINAL_RANK: 0,

    TIME_FIRST_OD: 0,
    TIME_FIRST_RX: 0,
    OD_DIFF: 0,
    RX_DIFF: 0
  },
  {
    CASE_NUMBER: '',
    RANK: 0,
    AGE: 0,
    PERIOD: 0,
    TIME_BEFORE_DEATH: 120,

    ALL_TYPES: 0,
    HEALTH_ENCOUNTERS: 0,
    OPIOID_PRESCRIPTIONS: 0,
    INCARCERATIONS: 0,
    OVERDOSES: 0,
    NUM_ENCOUNTERS_TOTAL: 0,

    AGE_RANK: 0,
    HEALTH_RANK: 0,
    OVERDOSE_RANK: 0,
    INCARCERATIONS_RANK: 0,
    PRESCRIPTIONS_RANK: 0,
    FINAL_RANK: 0,

    TIME_FIRST_OD: 0,
    TIME_FIRST_RX: 0,
    OD_DIFF: 0,
    RX_DIFF: 0
  }
];


export class Visualization6DataHandler implements DataHandler {
  static readonly OPTIONS: Visualization6DataHandlerOptions = {};

  static withOptions(options: Visualization6DataHandlerOptions): DataHandlerType {
    return class extends this {
      static readonly OPTIONS = options;
    };
  }

  readonly options = (this.constructor as typeof Visualization6DataHandler).OPTIONS;

  private data?: DataEntry[];
  private sortBy: SortField = 'HEALTH_RANK';
  private sortRanks: Record<string, Record<SortField, number>> = {};
  private ranks?: number[];
  private ranksLookup?: Set<number>;
  private age?: [number, number];
  private numEncounters?: [number, number];

  private scheduledUpdateCall?: ReturnType<typeof setTimeout>;

  constructor(readonly view: View) {
    view.addDataListener('source', (_name, data: DataEntry[]) => {
      this.data = data;
      this.sortRanks = this.compileSortRanks(data);
      this.scheduleUpdateCall();
    });

    view.addSignalListener('sort_by__field', (_name, value: SortField) => {
      this.sortBy = value;
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

    view.addSignalListener('encounters', (_name, value: SignalValue<'NUM_ENCOUNTERS_TOTAL', [number, number]>) => {
      this.numEncounters = value.NUM_ENCOUNTERS_TOTAL;
      this.scheduleUpdateCall();
    });
  }

  finalize(): void {
    this.clearScheduledUpdateCall();

    this.data = undefined;
    this.sortBy = 'HEALTH_RANK';
    this.sortRanks = {};
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
    }, this.options.debounceTime ?? 500);
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

    data = this.sortData(data);
    data = this.limitData(data);
    data = this.setRanks(data);

    if (data.length === 0) {
      data = fakeEntries;
    }

    this.view.data('processed_source', data);
  }

  private compileSortRanks(data: DataEntry[]): Record<string, Record<SortField, number>> {
    const sortRanks: Record<string, Record<SortField, number>> = {};
    for (const { CASE_NUMBER, AGE_RANK, HEALTH_RANK, OVERDOSE_RANK, TIME_FIRST_OD, TIME_FIRST_RX, OD_DIFF, RX_DIFF, INCARCERATIONS_RANK, PRESCRIPTIONS_RANK } of data) {
      sortRanks[CASE_NUMBER] ??= { AGE_RANK, HEALTH_RANK, OVERDOSE_RANK, TIME_FIRST_OD, TIME_FIRST_RX, OD_DIFF, RX_DIFF, INCARCERATIONS_RANK, PRESCRIPTIONS_RANK };
    }

    return sortRanks;
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

  private sortData(data: DataEntry[]): DataEntry[] {
    const { sortBy, sortRanks } = this;
    const getRank = (entry: DataEntry) => sortRanks[entry.CASE_NUMBER][sortBy];

    return data.sort((a, b) => getRank(a) - getRank(b));
  }

  private limitData(data: DataEntry[]): DataEntry[] {
    const { options: { maxCasesShown = 43 } } = this;
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

  private setRanks(data: DataEntry[]): DataEntry[] {
    let previousCaseNumber = '';
    let rank = -1;

    return data.map(entry => {
      if (entry.CASE_NUMBER !== previousCaseNumber) {
        previousCaseNumber = entry.CASE_NUMBER;
        rank += 1;
      }

      return {
        ...entry,
        ...ingest({}), // Create a new unique vega tuple id
        FINAL_RANK: rank
      };
    });
  }
}
