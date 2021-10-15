import { View } from 'vega';

import { DataHandler } from './data-handler';



type SignalValue<K extends PropertyKey, T> = Record<K, T | undefined>;

interface DataEntry {
  /* eslint-disable @typescript-eslint/naming-convention */
  CASE_NUMBER: string;
  RANK: number;
  AGE: number;
  PERIOD: unknown;
  TIME_BEFORE_DEATH: number;
  NUM_ENCOUNTERS_TOTAL: number;

  ALL_TYPES: number;
  HEALTH_ENCOUNTERS: number;
  OPIOID_PRESCRIPTIONS: number;
  INCARCERATIONS: number;
  OVERDOSES: number;
  /* eslint-enable @typescript-eslint/naming-convention */
}


export class Visualization6DataHandler implements DataHandler {
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
}
