/* eslint-disable @typescript-eslint/naming-convention */
import { View, ingest } from 'vega';

import { DataHandler, DataHandlerType } from './data-handler';


type SignalValue<K extends PropertyKey, T> = Record<K, T | undefined>;

type SortField = 'AGE_RANK' | 'HEALTH_RANK' | 'OVERDOSE_RANK' | 'TIME_FIRST_OD' | 'TIME_FIRST_RX' | 'OD_DIFF' | 'RX_DIFF' | 'INCARCERATIONS_RANK' | 'PRESCRIPTIONS_RANK';

interface DataEntry {
  CASE_NUMBER: string;
  RANK: number;
  AGE: number;
  SEX: string;
  PERIOD: number;
  TIME_BEFORE_DEATH: number;

  ALL_TYPES: number;
  HEALTH_ENCOUNTERS: number;
  OPIOID_PRESCRIPTIONS: number;
  INCARCERATIONS: number;
  OVERDOSES: number;
  NUM_ENCOUNTERS_TOTAL: number;
  NUM_INCARCERATIONS_TOTAL: number;

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
    SEX: '',
    PERIOD: 0,
    TIME_BEFORE_DEATH: 0,

    ALL_TYPES: 0,
    HEALTH_ENCOUNTERS: 0,
    OPIOID_PRESCRIPTIONS: 0,
    INCARCERATIONS: 0,
    OVERDOSES: 0,
    NUM_ENCOUNTERS_TOTAL: 0,
    NUM_INCARCERATIONS_TOTAL: 0,

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
    SEX: '',
    PERIOD: 0,
    TIME_BEFORE_DEATH: 120,

    ALL_TYPES: 0,
    HEALTH_ENCOUNTERS: 0,
    OPIOID_PRESCRIPTIONS: 0,
    INCARCERATIONS: 0,
    OVERDOSES: 0,
    NUM_ENCOUNTERS_TOTAL: 0,
    NUM_INCARCERATIONS_TOTAL: 0,

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
  private clusterBy: keyof DataEntry = 'SEX';
  private sortRanks: Record<string, Record<SortField, number>> = {};
  private ranks?: number[];
  private ranksLookup?: Set<number>;
  private age?: [number, number];
  private numEncounters?: [number, number];
  private numIncarcerations?: [number, number];

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

    view.addSignalListener('incarcerations', (_name, value: SignalValue<'NUM_INCARCERATIONS_TOTAL', [number, number]>) => {
      this.numIncarcerations = value.NUM_INCARCERATIONS_TOTAL;
      this.scheduleUpdateCall();
    });
  }

  finalize(): void {
    this.clearScheduledUpdateCall();

    this.data = undefined;
    this.sortBy = 'HEALTH_RANK';
    this.clusterBy = 'SEX';
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

    data = this.clusterData(data);
    this.sortRanks = this.compileSortRanks(data);

    data = this.filterByRank(data);
    data = this.filterByAge(data);
    data = this.filterByEncounters(data);
    data = this.filterByIncarcerations(data);

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

  private clusterData(data: DataEntry[]): DataEntry[] {
    const { clusterBy } = this;
    const clusteredData: Record<number, DataEntry[]> = {};
    let maxValue: number;
    switch (this.clusterBy) {
      case 'AGE':
        maxValue = 100;
        break;
      case 'SEX':
        maxValue = 1;
        break;
      default:
        maxValue = Math.max(...data.map(o => o[clusterBy] as number), 0);
    }

    for (const entry of data) {
      const value = entry[clusterBy];
      let cluster = 0;
      if (clusterBy === 'SEX') {
        cluster = value === 'M' ? 0 : 1; // M=0, F=1
      } else {
        cluster = Math.floor(value as number/maxValue * 10);
      }
      if (clusteredData[cluster]) {
        clusteredData[cluster].push(entry);
      } else {
        clusteredData[cluster] = [entry];
      }
    }

    return this.createClusterCases(clusteredData);
  }

  private createClusterCases(clusteredData: Record<number, DataEntry[]>): DataEntry[] {
    let result: DataEntry[] = [];
    const keys = Object.keys(clusteredData);

    for (const key of keys) {
      const binNum = parseInt(key);
      result = result.concat(this.createClusterCase(clusteredData[binNum], binNum));
    }

    return result;
  }

  private createClusterCase(dataCluster: DataEntry[], binNum: number): DataEntry[] {
    const result: DataEntry[] = [];
    const periodCases: Record<number, DataEntry[]> = {};

    for (const entry of dataCluster) {
      if (!periodCases[entry.PERIOD]) {
        periodCases[entry.PERIOD] = [entry];
      } else {
        periodCases[entry.PERIOD].push(entry);
      }
    }

    const keys = Object.keys(periodCases);
    for (const key of keys) {
      const k = parseInt(key);
      result.push(this.createPeriodEntry(periodCases[k], binNum));
    }

    return result;
  }

  private createPeriodEntry(periodData: DataEntry[], binNum: number): DataEntry {
    const length = periodData.length;
    let representativeCase: DataEntry = {
      CASE_NUMBER: binNum.toString(),
      RANK: 0,
      AGE: 0,
      SEX: periodData[0].SEX,
      PERIOD: periodData[0].PERIOD,
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
    };

    periodData.forEach(value => {
      representativeCase.RANK += value.RANK;
      representativeCase.AGE += value.AGE;
      representativeCase.TIME_BEFORE_DEATH += value.TIME_BEFORE_DEATH;
      representativeCase.ALL_TYPES += value.ALL_TYPES;
      representativeCase.HEALTH_ENCOUNTERS += value.HEALTH_ENCOUNTERS;
      representativeCase.OPIOID_PRESCRIPTIONS += value.OPIOID_PRESCRIPTIONS;
      representativeCase.INCARCERATIONS += value.INCARCERATIONS;
      representativeCase.OVERDOSES += value.OVERDOSES;
      representativeCase.NUM_ENCOUNTERS_TOTAL += value.NUM_ENCOUNTERS_TOTAL;
      representativeCase.AGE_RANK += value.AGE_RANK;
      representativeCase.HEALTH_RANK += value.HEALTH_RANK;
      representativeCase.OVERDOSE_RANK += value.OVERDOSE_RANK;
      representativeCase.INCARCERATIONS_RANK += value.INCARCERATIONS_RANK;
      representativeCase.PRESCRIPTIONS_RANK += value.PRESCRIPTIONS_RANK;
      representativeCase.FINAL_RANK += value.FINAL_RANK;
      representativeCase.TIME_FIRST_OD += value.TIME_FIRST_OD;
      representativeCase.TIME_FIRST_RX += value.TIME_FIRST_RX;
      representativeCase.OD_DIFF += value.OD_DIFF;
      representativeCase.RX_DIFF += value.RX_DIFF;
    });

    representativeCase = {
      ...representativeCase,
      RANK: representativeCase.RANK/length,
      AGE: representativeCase.AGE/length,
      TIME_BEFORE_DEATH: representativeCase.TIME_BEFORE_DEATH/length,
      ALL_TYPES: representativeCase.ALL_TYPES/length,
      HEALTH_ENCOUNTERS: representativeCase.HEALTH_ENCOUNTERS/length,
      OPIOID_PRESCRIPTIONS: representativeCase.OPIOID_PRESCRIPTIONS/length,
      INCARCERATIONS: representativeCase.INCARCERATIONS/length,
      OVERDOSES: representativeCase.OVERDOSES/length,
      NUM_ENCOUNTERS_TOTAL: representativeCase.NUM_ENCOUNTERS_TOTAL/length,
      AGE_RANK: representativeCase.AGE_RANK/length,
      HEALTH_RANK: representativeCase.HEALTH_RANK/length,
      OVERDOSE_RANK: representativeCase.OVERDOSE_RANK/length,
      INCARCERATIONS_RANK: representativeCase.INCARCERATIONS_RANK/length,
      PRESCRIPTIONS_RANK: representativeCase.PRESCRIPTIONS_RANK/length,
      FINAL_RANK: representativeCase.FINAL_RANK/length,
      TIME_FIRST_OD: representativeCase.TIME_FIRST_OD/length,
      TIME_FIRST_RX: representativeCase.TIME_FIRST_RX/length,
      OD_DIFF: representativeCase.OD_DIFF/length,
      RX_DIFF: representativeCase.RX_DIFF/length
    };

    return representativeCase;
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

  private filterByIncarcerations(data: DataEntry[]): DataEntry[] {
    const { numIncarcerations } = this;
    if (numIncarcerations === undefined) {
      return data;
    }

    const [min, max] = numIncarcerations;
    return data.filter(({ NUM_INCARCERATIONS_TOTAL: value }) => min <= value && value <= max);
  }

  private sortData(data: DataEntry[]): DataEntry[] {
    const { sortBy, sortRanks } = this;
    const getRank = (entry: DataEntry) => sortRanks[entry.CASE_NUMBER][sortBy];

    return data.sort((a, b) => getRank(a) - getRank(b));
  }

  private limitData(data: DataEntry[]): DataEntry[] {
    const { options: { maxCasesShown = 54 } } = this;
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
