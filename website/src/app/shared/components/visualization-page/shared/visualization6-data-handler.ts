/* eslint-disable @typescript-eslint/naming-convention */
import { loader, read, Runtime, View, ViewOptions } from 'vega';


export class VisualizationSixDataHandler {
  srcData: Record<string, unknown>[] = [];
  caseRanks: Record<string, Record<string, number>> = {};

  constructor(private view: View) {
    this.setData();

    this.view.addSignalListener('data_variable_selection', (_name, data: { LABEL: string[] }) => {
      setTimeout(() => {
        this.updateDataVariable(data.LABEL && data.LABEL.length > 0 ? data.LABEL[0] : undefined);
      });
    });
  }

  async setData(): Promise<void> {
    this.srcData = (await loader()
      .load('assets/generated/visualization6/data.csv')
      .then((csv_data: string) =>
        read(csv_data, {
          type: 'csv',
          parse: {
            PERIOD: 'date',
            DOD: 'date',
            RANK: 'number',
            CASE_NUMBER: 'number',
            AGE: 'number',
            OVERDOSES: 'number',
            HEALTH_ENCOUNTERS: 'number',
            HEALTH_RANK: 'number',
            OVERDOSE_RANK: 'number',
            AGE_RANK: 'number'
          }
        }) as Record<string, unknown>[]
      )).slice(0, 1000);

    const caseRanks = this.caseRanks;
    for (const datum of this.srcData) {
      const caseNumber = datum['CASE_NUMBER'] as string;
      const ranks = caseRanks[caseNumber];
      if (!ranks) {
        caseRanks[caseNumber] = {
          'OVERDOSE_RANK': datum['OVERDOSE_RANK'] as number,
          'HEALTH_RANK': datum['HEALTH_RANK'] as number,
          'AGE_RANK': datum['AGE_RANK'] as number
        };
      }
    }
    Object.values(caseRanks)
      .sort((rowA, rowB) => (rowA.OVERDOSE_RANK) - (rowB.OVERDOSE_RANK))
      .forEach((x, index) => (x.OVERDOSE_RANK = index + 1));
    Object.values(caseRanks)
      .sort((rowA, rowB) => (rowA.HEALTH_RANK) - (rowB.HEALTH_RANK))
      .forEach((x, index) => (x.HEALTH_RANK = index + 1));
    Object.values(caseRanks)
      .sort((rowA, rowB) => (rowA.AGE_RANK) - (rowB.AGE_RANK))
      .forEach((x, index) => (x.AGE_RANK = index + 1));

    this.updateDataVariable('Health encounters');
  }

  async updateDataVariable(dataVariable?: string): Promise<void> {
    if (dataVariable) {
      const data = this.srcData;
      const caseRanks = this.caseRanks;

      let rankField = 'FINAL_RANK';
      switch (dataVariable) {
        case 'Overdoses':
          rankField = 'OVERDOSE_RANK';
          break;
        case 'Health encounters':
          rankField = 'HEALTH_RANK';
          break;
        case 'Age':
          rankField = 'AGE_RANK';
          break;
      }

      const otherDataLoaded = this.view.data('source')?.length > 0 ?? false;
      if (otherDataLoaded) {
        const update = this.view.changeset();
        data.forEach(x => update.modify(x, 'FINAL_RANK', caseRanks[x['CASE_NUMBER'] as string][rankField]));
        this.view.change('source', update);
      } else {
        data.forEach(x => (x['FINAL_RANK'] = caseRanks[x['CASE_NUMBER'] as string][rankField]));
        this.view.data('source', data);
      }

      this.view.resize();
      await this.view.runAsync();
    }
  }

  finalize(): void {
    this.srcData = [];
    this.caseRanks = {};
  }
}

export class VisualizationSixView extends View {
  dataHandler: VisualizationSixDataHandler;
  constructor(runtime: Runtime, opt?: ViewOptions) {
    super(runtime, opt);
    this.dataHandler = new VisualizationSixDataHandler(this);
  }
  finalize(): this {
    this.dataHandler.finalize();
    return super.finalize();
  }
}
