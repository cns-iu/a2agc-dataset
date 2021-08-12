import { Distribution } from './distribution.model';


export interface Dataset {
  name: string;
  description: string;
  variables: string[];
}

export interface DatasetVariable {
  dataset: string;
  name: string;
  description: string;

  type: string;
  nonNullCount: number;
  percentMissing: number;
  distribution: Distribution;
}

export interface DatasetMetaEntry {
  label: string;
  value: string;
}
