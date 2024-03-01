/**
 * Dataset config settings
 */
export const DATA_CONFIG = {
  datasetsPath: 'assets/generated/aggregate-table-data.json',
  subLabel: 'Drug',
  subLabelFlag: 'Tox lab flag',
  timeSliderSource: ['deaths', 'DOD'] as const
};


/**
 * Chart type names
 */
export enum ChartType {
  pie = 'pie-chart',
  verticalBar = 'vertical-bar-chart',
  horizontalBar = 'horizontal-bar-chart'
}

/**
 * Chart configuration interface
 */
export interface ChartConfig {
  /** Maximum distinct values allowed in chart */
  maxDistinctValues: number;
}

/**
 * Chart config settings
 */
export const CHART_CONFIG: Record<ChartType, ChartConfig> = {
  [ChartType.pie]: {
    maxDistinctValues: 4
  },

  [ChartType.verticalBar]: {
    maxDistinctValues: 50
  },

  [ChartType.horizontalBar]: {
    maxDistinctValues: 500
  }
};
