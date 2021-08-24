export enum DistributionType {
  pie = 'pie-chart',
  histogram = 'histogram',
  verticalBar = 'bar-chart',
  horizontalBar = 'horizontal-bar-chart',
  summary = 'summary'
}

export interface Distribution {
  type: DistributionType | string;
  summary: DistributionSummary;
  url: string;
}

export interface DistributionSummary {
  distinct: number;
  min: number;
  max: number;
}

export interface DistributionDataEntry {
  period: Date | undefined;
  value: unknown;
  count: number;
}
