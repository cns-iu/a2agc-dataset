export interface Dataset {
  dataset: string;
  dataVariables: string[];
  description?: string;
  subLabel?: string;
  subDataVariables?: string[];
}

export const EMPTY_DATASET: Dataset = {
  dataset: '',
  dataVariables: []
}
