import { VisualizationSpec } from 'vega-embed';
import { VariableData, DistributionData } from '../data-distributions.component';

import { createBarSpec, createHorizBarSpec } from './bar-chart.vl';
import { createPieSpec } from './pie-chart.vl';
import { createTimeSpec } from './time-slider.vl';

const pieVariableData: VariableData = {
  dataset: 'Deaths',
  name: 'Cocaine',
  variableName: 'COCAINE',
  type: 'Boolean',
  description: 'Tox lab flag',
  missingValues: 0.0
};

const barVariableData: VariableData = {
  dataset: 'Diagnoses',
  name: 'DOD',
  variableName: 'DOD',
  type: 'Character',
  description: 'Date of death from coroner data',
  missingValues: 0.0,
  xLabel: 'DOD',
  yLabel: 'Count of Records'
};

const horizBarVariableData: VariableData = {
  dataset: 'Deaths',
  name: 'Education',
  variableName: 'EDUCATION',
  type: 'Character',
  description: 'Social Covariates',
  missingValues: 17.37,
  xLabel: '# Total Deaths',
  yLabel: 'Education Level'
};

const pieDistributionData: DistributionData[] = [
  { period: '2010-01-01', value: 0, count: 19 },
  { period: '2010-01-01', value: 1, count: 7 },
  { period: '2010-04-01', value: 0, count: 30 },
  { period: '2010-04-01', value: 1, count: 12 },
  { period: '2010-07-01', value: 0, count: 28 },
  { period: '2010-07-01', value: 1, count: 5 },
  { period: '2010-10-01', value: 0, count: 27 },
  { period: '2010-10-01', value: 1, count: 4 },
  { period: '2011-01-01', value: 0, count: 26 },
  { period: '2011-01-01', value: 1, count: 10 },
  { period: '2011-04-01', value: 0, count: 26 },
  { period: '2011-04-01', value: 1, count: 13 },
  { period: '2011-07-01', value: 0, count: 27 },
  { period: '2011-07-01', value: 1, count: 8 },
  { period: '2011-10-01', value: 0, count: 40 },
  { period: '2011-10-01', value: 1, count: 9 },
  { period: '2012-01-01', value: 0, count: 31 },
  { period: '2012-01-01', value: 1, count: 13 },
  { period: '2012-04-01', value: 0, count: 36 },
  { period: '2012-04-01', value: 1, count: 11 },
  { period: '2012-07-01', value: 0, count: 43 },
  { period: '2012-07-01', value: 1, count: 11 },
  { period: '2012-10-01', value: 0, count: 36 },
  { period: '2012-10-01', value: 1, count: 12 },
  { period: '2013-01-01', value: 0, count: 47 },
  { period: '2013-01-01', value: 1, count: 6 },
  { period: '2013-04-01', value: 0, count: 56 },
  { period: '2013-04-01', value: 1, count: 10 },
  { period: '2013-07-01', value: 0, count: 40 },
  { period: '2013-07-01', value: 1, count: 14 },
  { period: '2013-10-01', value: 0, count: 39 },
  { period: '2013-10-01', value: 1, count: 14 },
  { period: '2014-01-01', value: 0, count: 32 },
  { period: '2014-01-01', value: 1, count: 13 },
  { period: '2014-04-01', value: 0, count: 64 },
  { period: '2014-04-01', value: 1, count: 14 },
  { period: '2014-07-01', value: 0, count: 61 },
  { period: '2014-07-01', value: 1, count: 14 },
  { period: '2014-10-01', value: 0, count: 33 },
  { period: '2014-10-01', value: 1, count: 13 },
  { period: '2015-01-01', value: 0, count: 40 },
  { period: '2015-01-01', value: 1, count: 19 },
  { period: '2015-04-01', value: 0, count: 71 },
  { period: '2015-04-01', value: 1, count: 8 },
  { period: '2015-07-01', value: 0, count: 61 },
  { period: '2015-07-01', value: 1, count: 11 },
  { period: '2015-10-01', value: 0, count: 53 },
  { period: '2015-10-01', value: 1, count: 7 },
  { period: '2016-01-01', value: 0, count: 54 },
  { period: '2016-01-01', value: 1, count: 17 },
  { period: '2016-04-01', value: 0, count: 70 },
  { period: '2016-04-01', value: 1, count: 20 },
  { period: '2016-07-01', value: 0, count: 70 },
  { period: '2016-07-01', value: 1, count: 20 },
  { period: '2016-10-01', value: 0, count: 83 },
  { period: '2016-10-01', value: 1, count: 11 },
  { period: '2017-01-01', value: 0, count: 76 },
  { period: '2017-01-01', value: 1, count: 20 },
  { period: '2017-04-01', value: 0, count: 81 },
  { period: '2017-04-01', value: 1, count: 22 },
  { period: '2017-07-01', value: 0, count: 74 },
  { period: '2017-07-01', value: 1, count: 21 },
  { period: '2017-10-01', value: 0, count: 89 },
  { period: '2017-10-01', value: 1, count: 23 },
  { period: '2018-01-01', value: 0, count: 64 },
  { period: '2018-01-01', value: 1, count: 24 },
  { period: '2018-04-01', value: 0, count: 76 },
  { period: '2018-04-01', value: 1, count: 16 },
  { period: '2018-07-01', value: 0, count: 66 },
  { period: '2018-07-01', value: 1, count: 21 },
  { period: '2018-10-01', value: 0, count: 69 },
  { period: '2018-10-01', value: 1, count: 20 }
];

const barDistributionData: DistributionData[] = [
  { value: '2010-01-01', count: 10000 },
  { value: '2012-10-01', count: 70000 },
  { value: '2013-07-01', count: 50000 },
  { value: '2014-01-01', count: 10000 },
  { value: '2014-10-01', count: 30000 },
  { value: '2015-04-01', count: 20000 },
  { value: '2015-10-01', count: 40000 },
  { value: '2016-01-01', count: 30000 },
  { value: '2016-04-01', count: 10000 },
  { value: '2018-07-01', count: 20000 },
  { value: '2018-10-01', count: 10000 }
];

const horizBarDistributionData: DistributionData[] = [
  { value: 'College degree', count: 2 },
  { value: 'Graduated high school', count: 5 },
  { value: 'High school - Not finished', count: 14 },
  { value: 'Some college - No degree', count: 5 },
  { value: 'College degree', count: 4 },
  { value: 'Graduated high school', count: 16 },
  { value: 'High school - Not finished', count: 12 },
  { value: 'Post graduation degree (Masters, PHD, MD, etc.)', count: 2 },
  { value: 'Some college - No degree', count: 5 }
];

export function createDemoPieSpec(): VisualizationSpec {
  return createPieSpec(pieVariableData, pieDistributionData);
}

export function createDemoBarSpec(): VisualizationSpec {
  return createBarSpec(barVariableData, barDistributionData);
}

export function createDemoHorizBarSpec(): VisualizationSpec {
  return createHorizBarSpec(horizBarVariableData, horizBarDistributionData);
}

export function createDemoTimeSpec(): VisualizationSpec {
  return createTimeSpec(pieDistributionData);
}
