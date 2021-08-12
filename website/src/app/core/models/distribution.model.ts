export type DistributionType = string;

export interface Distribution {
  type: DistributionType;
  summary: DistributionSummary;
  url: string;
}

export interface DistributionSummary {
  distinct: number;
  min: number;
  max: number;
}

export interface DistributionDataEntry {
  period: string;
  value: string | number;
  count: number;
}
