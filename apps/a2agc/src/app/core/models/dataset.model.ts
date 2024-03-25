import { Distribution } from './distribution.model';


/**
 * Dataset interface
 */
export interface Dataset {
  /** Dataset name */
  name: string;
  /** Dataset description */
  description: string;
  /** Dataset variable names */
  variables: string[];
}

/**
 * Dataset variable interface
 */
export interface DatasetVariable {
  /** Dataset of variable */
  dataset: string;
  /** Variable name */
  name: string;
  /** Variable description */
  description: string;
  /** Variable type */
  type: string;
  /** Number of non null values */
  nonNullCount: number;
  /** Percent of missing values */
  percentMissing: number;
  /** Variable distribution info */
  distribution: Distribution;
}

/**
 * Dataset meta entry interface
 */
export interface DatasetMetaEntry {
  /** Entry label */
  label: string;
  /** Entry value */
  value: string;
}
