/* eslint-disable @typescript-eslint/naming-convention */
import { View, ingest } from 'vega';

import { DataHandler, DataHandlerType } from './data-handler';


/** Signal value */
type SignalValue<K extends PropertyKey, T> = Record<K, T | undefined>;

/** Fields to sort by */
type SortField = 'AGE_RANK' | 'HEALTH_RANK' | 'OVERDOSE_RANK' | 'TIME_FIRST_OD' | 'TIME_FIRST_RX' | 'OD_DIFF' | 'RX_DIFF' | 'INCARCERATIONS_RANK' | 'PRESCRIPTIONS_RANK';

/**
 * Data entry info
 */
interface DataEntry {
  /** Case number */
  CASE_NUMBER: string;
  /** Entry rank */
  RANK: number;
  /** Age at death */
  AGE: number;
  /** Time incident occurred */
  PERIOD: number;
  /** How long before death the incident occurred */
  TIME_BEFORE_DEATH: number;

  /** Total number of events */
  ALL_TYPES: number;
  /** Number of health encounters */
  HEALTH_ENCOUNTERS: number;
  /** Number of opioid prescriptions */
  OPIOID_PRESCRIPTIONS: number;
  /** Number of incarcerations */
  INCARCERATIONS: number;
  /** Number of opioid overdoses */
  OVERDOSES: number;
  /** Total number of health encounters */
  NUM_ENCOUNTERS_TOTAL: number;
  /** Total number of incarcerations */
  NUM_INCARCERATIONS_TOTAL: number;

  /** Age rank */
  AGE_RANK: number;
  /** Health encounters rank */
  HEALTH_RANK: number;
  /** Overdoses rank */
  OVERDOSE_RANK: number;
  /** Incarcerations rank */
  INCARCERATIONS_RANK: number;
  /** Opioid prescriptions rank */
  PRESCRIPTIONS_RANK: number;
  /** Final rank */
  FINAL_RANK: number;

  /** Time of first overdose */
  TIME_FIRST_OD: number;
  /** Time of first prescription */
  TIME_FIRST_RX: number;
  /** Time between first overdose and death */
  OD_DIFF: number;
  /** Time between first prescription and death */
  RX_DIFF: number;
}

/**
 * Visualization6 data handler options
 */
export interface Visualization6DataHandlerOptions {
  /** Debounce time */
  debounceTime?: number;
  /** Maximum entries shown */
  maxCasesShown?: number;
}


/**
 * Used when the resulting data is empty to prevent the visualization view from blowing up
 */
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


/**
 * Data handler for visualization 6 (Maps of Health)
 */
export class Visualization6DataHandler implements DataHandler {
  /** Visualization data handler options */
  static readonly OPTIONS: Visualization6DataHandlerOptions = {};

  /**
   * Withs options
   * @param options
   * @returns options
   */
  static withOptions(options: Visualization6DataHandlerOptions): DataHandlerType {
    return class extends this {
      static readonly OPTIONS = options;
    };
  }

  /** Data handler options for vis6 */
  readonly options = (this.constructor as typeof Visualization6DataHandler).OPTIONS;

  /** Data entries */
  private data?: DataEntry[];
  /** Field to sort data entries by */
  private sortBy: SortField = 'HEALTH_RANK';
  /** Ranks compilation */
  private sortRanks: Record<string, Record<SortField, number>> = {};
  /** Ranks */
  private ranks?: number[];
  /** Ranks lookup */
  private ranksLookup?: Set<number>;
  /** Selected age range */
  private age?: [number, number];
  /** Selected encounters range */
  private numEncounters?: [number, number];
  /** Selected incarcerations range */
  private numIncarcerations?: [number, number];

  /** Scheduled update call of visualization6 data handler */
  private scheduledUpdateCall?: ReturnType<typeof setTimeout>;

  /**
   * Adds listeners to view and schedules update calls
   * @param view view
   */
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

  /**
   * Clears scheduled update calls and resets everything
   */
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

  /**
   * Updates data and resizes view
   */
  private scheduleUpdateCall(): void {
    this.clearScheduledUpdateCall();

    this.scheduledUpdateCall = setTimeout(async () => {
      this.clearScheduledUpdateCall();
      this.updateData();
      this.view.resize();
      await this.view.runAsync();
    }, this.options.debounceTime ?? 500);
  }

  /**
   * Clears scheduled update call
   */
  private clearScheduledUpdateCall(): void {
    if (this.scheduledUpdateCall !== undefined) {
      clearTimeout(this.scheduledUpdateCall);
      this.scheduledUpdateCall = undefined;
    }
  }

  /**
   * Filters and sorts data in view
   */
  private updateData(): void {
    let { data = [] } = this;

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

  /**
   * Compiles sort values for all cases
   * @param data data entries
   * @returns record of ranks for each field per case
   */
  private compileSortRanks(data: DataEntry[]): Record<string, Record<SortField, number>> {
    const sortRanks: Record<string, Record<SortField, number>> = {};
    for (const { CASE_NUMBER, AGE_RANK, HEALTH_RANK, OVERDOSE_RANK, TIME_FIRST_OD, TIME_FIRST_RX, OD_DIFF, RX_DIFF, INCARCERATIONS_RANK, PRESCRIPTIONS_RANK } of data) {
      sortRanks[CASE_NUMBER] ??= { AGE_RANK, HEALTH_RANK, OVERDOSE_RANK, TIME_FIRST_OD, TIME_FIRST_RX, OD_DIFF, RX_DIFF, INCARCERATIONS_RANK, PRESCRIPTIONS_RANK };
    }

    return sortRanks;
  }

  /**
   * Filters data by rank
   * @param data data entries
   * @returns filtered data
   */
  private filterByRank(data: DataEntry[]): DataEntry[] {
    const { ranks } = this;
    if (ranks === undefined) {
      return data;
    }

    const lookup = (this.ranksLookup ??= new Set(ranks));
    return data.filter(({ RANK: value }) => lookup.has(value));
  }

  /**
   * Filters data by age range
   * @param data data entries
   * @returns filtered data
   */
  private filterByAge(data: DataEntry[]): DataEntry[] {
    const { age } = this;
    if (age === undefined) {
      return data;
    }

    const [min, max] = age;
    return data.filter(({ AGE: value }) => min <= value && value <= max);
  }

  /**
   * Filters data by encounters range
   * @param data data entries
   * @returns filtered data
   */
  private filterByEncounters(data: DataEntry[]): DataEntry[] {
    const { numEncounters } = this;
    if (numEncounters === undefined) {
      return data;
    }

    const [min, max] = numEncounters;
    return data.filter(({ NUM_ENCOUNTERS_TOTAL: value }) => min <= value && value <= max);
  }

  /**
   * Filters data by incarcerations
   * @param data data entries
   * @returns filtered data
   */
  private filterByIncarcerations(data: DataEntry[]): DataEntry[] {
    const { numIncarcerations } = this;
    if (numIncarcerations === undefined) {
      return data;
    }

    const [min, max] = numIncarcerations;
    return data.filter(({ NUM_INCARCERATIONS_TOTAL: value }) => min <= value && value <= max);
  }

  /**
   * Sorts data by current sort field
   * @param data data entries
   * @returns data sorted data
   */
  private sortData(data: DataEntry[]): DataEntry[] {
    const { sortBy, sortRanks } = this;
    const getRank = (entry: DataEntry) => sortRanks[entry.CASE_NUMBER][sortBy];

    return data.sort((a, b) => getRank(a) - getRank(b));
  }

  /**
   * Limit amount of data shown
   * @param data list of data entries
   * @returns updated list of data entries
   */
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

  /**
   * Sets final ranks in data
   * @param data data entries
   * @returns data with updated final_rank
   */
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
