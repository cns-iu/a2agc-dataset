/* eslint-disable camelcase */
export interface TableData {
  name: string;
  remarks: string;
  row_count: number;
  columns: {
    [key:string]: {
      name: string;
      type: string;
      remarks: string;
      n_non_null: number;
      pct_missing: number;
      dist_type: string;
    };
  };
}

export interface TableDataDirectory {
  [key:string]: TableData;
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
  '': {
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
  }
};
