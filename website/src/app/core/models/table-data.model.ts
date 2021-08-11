/* eslint-disable @typescript-eslint/naming-convention */
import { VisualizationSpec } from 'vega-embed';

export interface TableData {
  name: string;
  remarks: string;
  row_count: number;
  columns: {
    [key: string]: {
      name: string;
      type: string;
      remarks: string;
      n_non_null: number;
      pct_missing: number;
      dist_type: string;
      dist_data?: VisualizationSpec | SummaryDistData;
    };
  };
}

export interface SummaryDistData {
  distinct: number;
  min: number;
  max: number;
}

export interface TableDataDirectory {
  [key: string]: TableData;
}

export const EMPTY_TABLE_DATA: TableData = {
  name: '',
  remarks: '',
  row_count: 0,
  columns: {
    '': {
      name: '',
      type: '',
      remarks: '',
      n_non_null: 0,
      pct_missing: 0,
      dist_type: ''
    }
  }
};

export const EMPTY_TABLE_DATA_DIRECTORY: TableDataDirectory = {
  '': EMPTY_TABLE_DATA
};
