import { VisualizationSpec } from 'vega-embed';

export interface Dataset {
  dataset: string;
  dataVariables: string[];
  description?: string;
  subLabel?: string;
  subDataVariables?: string[];
  specs: { [dataVariable: string]: VisualizationSpec };
}

export const EMPTY_DATASET: Dataset = {
  dataset: '',
  dataVariables: [],
  specs: {}
}
