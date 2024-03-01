/**
 * Distribution chart type
 */
export enum DistributionType {
  pie = 'pie-chart',
  histogram = 'histogram',
  verticalBar = 'bar-chart',
  horizontalBar = 'horizontal-bar-chart',
  summary = 'summary'
}

/**
 * Distribution info
 */
export interface Distribution {
  /** Type of distribution visualization */
  type: DistributionType | string;
  /** Summary of distribution data */
  summary: DistributionSummary;
  /** Distribution url */
  url: string;
}

/**
 * Distribution summary
 */
export interface DistributionSummary {
  /** Number of distinct values in distribution */
  distinct: number;
  /** Minimum value in distribution */
  min: number;
  /** Maximum value in distribution */
  max: number;
}

/**
 * Distribution data entry
 * @template T
 */
export interface DistributionDataEntry<T = unknown> {
  /** Time period of entry */
  period: Date | undefined;
  /** Entry value */
  value: T;
  /** Entry count */
  count: number;
}
