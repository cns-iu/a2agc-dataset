import { VisualizationSpec } from 'vega-embed';
import { SummaryDistData } from './table-data.model';

export interface Dataset {
  dataset: string;
  dataVariables: string[];
  description?: string;
  subLabel?: string;
  subDataVariables?: string[];
  specs: Record<string, VisualizationSpec>;
  columns: DatasetColumns;
}

export interface DatasetColumns {
  [key: string]: DatasetColumn;
}

export interface DatasetSummary {
  label: string;
  value: string;
}

export interface DatasetColumn {
  distData: string | VisualizationSpec | SummaryDistData;
  distType: string;
  nonNullCount: number;
  name: string;
  percentMissing: number;
  remarks: string;
  type: string;
}

export const EMPTY_DATASET: Dataset = {
  dataset: '',
  dataVariables: [],
  specs: {},
  columns: {}
};
