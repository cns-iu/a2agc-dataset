/* eslint-disable @typescript-eslint/naming-convention */
import { loader, read, Runtime, View, ViewOptions } from 'vega';


const dataVariableMapping: Record<string, string> = {
  'Gender': 'SEX',
  'Age': 'AGE',
  'Opioid Prescriptions within last year before death': 'OPIOID_PRESCRIPTIONS_1YEAR',
  'Any Opioid Prescriptions before death': 'ANY_PRESCRIPTIONS',
  'Prescription vs. Illicit Drugs': 'ILLICIT_V_PRESCRIPTION'
};

export class VisualizationOneDataHandler {
  subsets: Record<string, Record<string, unknown>[]> = {};

  constructor(private view: View) {
    this.setData();

    this.view.addSignalListener('data_variable_selection', (_name, data: { LABEL: string[] }) =>
      this.updateDataVariable(data.LABEL && data.LABEL.length > 0 ? data.LABEL[0] : undefined)
    );
  }

  async setData(): Promise<void> {
    const data = await loader()
      .load('assets/generated/vis-geomap-opioid-deaths.csv')
      .then((csv_data: string) =>
        read(csv_data, {
          type: 'csv',
          parse: {
            N_OPIOID_PRESCRIPTIONS: 'number',
            LATITUDE: 'number',
            LONGITUDE: 'number',
            PERIOD: 'date'
          }
        }) as Record<string, unknown>[]
      );

    Object.entries(dataVariableMapping)
      .forEach(([label, dataVariable]) => {
        this.subsets[label] = data.filter((row) => row.DATA_VARIABLE === dataVariable);
      });

    this.updateDataVariable('Age');
  }

  async updateDataVariable(dataVariable?: string): Promise<void> {
    if (dataVariable) {
      await this.view.runAsync();
      this.view.data('source', this.subsets[dataVariable] || []);
    }
  }

  finalize(): void {
    this.subsets = {};
  }
}

export class VisualizationOneView extends View {
  dataHandler: VisualizationOneDataHandler;
  constructor(runtime: Runtime, opt?: ViewOptions) {
    super(runtime, opt);
    this.dataHandler = new VisualizationOneDataHandler(this);
  }
  finalize(): this {
    this.dataHandler.finalize();
    return super.finalize();
  }
}
