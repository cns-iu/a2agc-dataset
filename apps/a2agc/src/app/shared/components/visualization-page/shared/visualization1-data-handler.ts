/* eslint-disable @typescript-eslint/naming-convention */
import { loader, read, Runtime, View, ViewOptions } from 'vega';

/** Maps labels to data variable */
const dataVariableMapping: Record<string, string> = {
  'Gender': 'SEX',
  'Age': 'AGE',
  'Opioid Prescriptions within last year before death': 'OPIOID_PRESCRIPTIONS_1YEAR',
  'Any Opioid Prescriptions before death': 'ANY_PRESCRIPTIONS',
  'Prescription vs. Illicit Drugs': 'ILLICIT_V_PRESCRIPTION'
};

/**
 * Data handler for visualization 1 (geomap)
 */
export class VisualizationOneDataHandler {
  /** Data handler */
  subsets: Record<string, Record<string, unknown>[]> = {};

  /**
   * Creates an instance of visualization 1 data handler.
   * setData method is called to initialize data subsets and set up a signal listener for data variable selection
   * @param view view
   */
  constructor(private view: View) {
    this.setData();

    this.view.addSignalListener('data_variable_selection', (_name, data: { LABEL: string[] }) =>
      this.updateDataVariable(data.LABEL && data.LABEL.length > 0 ? data.LABEL[0] : undefined)
    );
  }

  /**
   * Loads data from CSV file, parses it, and creates subsets of data based on different variables
   * @returns promise
   */
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

  /**
   * Updates view's data source with corresponding subset based on selected variable
   * @param dataVariable selected variable
   * @returns promise
   */
  async updateDataVariable(dataVariable?: string): Promise<void> {
    if (dataVariable) {
      await this.view.runAsync();
      this.view.data('source', this.subsets[dataVariable] || []);
    }
  }

  /**
   * Resets subsets
   */
  finalize(): void {
    this.subsets = {};
  }
}

/**
 * Visualization one view
 */
export class VisualizationOneView extends View {
  /** Data handler */
  dataHandler: VisualizationOneDataHandler;

  /**
   * Creates an instance of visualization one view.
   */
  constructor(runtime: Runtime, opt?: ViewOptions) {
    super(runtime, opt);
    this.dataHandler = new VisualizationOneDataHandler(this);
  }

  /**
   * Finalizes
   */
  finalize(): this {
    this.dataHandler.finalize();
    return super.finalize();
  }
}
