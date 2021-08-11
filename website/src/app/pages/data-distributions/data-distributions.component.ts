import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { EMPTY_TABLE_DATA, TableData } from 'src/app/core/models/table-data.model';
import { DataDistributionsState } from 'src/app/core/state/data-distribution/data-distribution.state';
import { VisualizationSpec } from 'vega-embed';

import { Dataset } from './../../core/models/dataset.model';
import { EMPTY_TABLE_DATA_DIRECTORY, TableDataDirectory } from './../../core/models/table-data.model';
import { createPieSpec, createBarSpec, createTimeSpec, VariableData, DistributionData } from './data-distributions.vega';


/**
 * Component
 */
@Component({
  selector: 'agc-data-distributions',
  templateUrl: './data-distributions.component.html',
  styleUrls: ['./data-distributions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataDistributionsComponent {
  /**
   * HTML class name
   */
  @HostBinding('class') readonly clsName = 'data-schema-browser';

  /**
   * Metadata for the selected variable
   */
  @Input() variable: VariableData = {
    // dataset: 'Deaths',
    // name: 'Cocaine',
    // variableName: 'COCAINE',
    // type: 'Boolean',
    // description: 'Tox lab flag',
    // missingValues: 0.0

    dataset: 'deaths',
    name: 'Education',
    variableName: 'EDUCATION',
    type: 'Character',
    description: 'Social Covariates',
    missingValues: 17.37,
    horizontal: true
  };


  /**
   * Vega-lite spec to be displayed
   */
  readonly spec: VisualizationSpec;

  readonly timeSpec: VisualizationSpec;

  readonly distributionData: DistributionData[] = [
    // {period: '2010-01-01', value: 0, count: 19},
    // {period: '2010-01-01', value: 1, count: 7},
    // {period: '2010-04-01', value: 0, count: 30},
    // {period: '2010-04-01', value: 1, count: 12},
    // {period: '2010-07-01', value: 0, count: 28},
    // {period: '2010-07-01', value: 1, count: 5},
    // {period: '2010-10-01', value: 0, count: 27},
    // {period: '2010-10-01', value: 1, count: 4},
    // {period: '2011-01-01', value: 0, count: 26},
    // {period: '2011-01-01', value: 1, count: 10},
    // {period: '2011-04-01', value: 0, count: 26},
    // {period: '2011-04-01', value: 1, count: 13},
    // {period: '2011-07-01', value: 0, count: 27},
    // {period: '2011-07-01', value: 1, count: 8},
    // {period: '2011-10-01', value: 0, count: 40},
    // {period: '2011-10-01', value: 1, count: 9},
    // {period: '2012-01-01', value: 0, count: 31},
    // {period: '2012-01-01', value: 1, count: 13},
    // {period: '2012-04-01', value: 0, count: 36},
    // {period: '2012-04-01', value: 1, count: 11},
    // {period: '2012-07-01', value: 0, count: 43},
    // {period: '2012-07-01', value: 1, count: 11},
    // {period: '2012-10-01', value: 0, count: 36},
    // {period: '2012-10-01', value: 1, count: 12},
    // {period: '2013-01-01', value: 0, count: 47},
    // {period: '2013-01-01', value: 1, count: 6},
    // {period: '2013-04-01', value: 0, count: 56},
    // {period: '2013-04-01', value: 1, count: 10},
    // {period: '2013-07-01', value: 0, count: 40},
    // {period: '2013-07-01', value: 1, count: 14},
    // {period: '2013-10-01', value: 0, count: 39},
    // {period: '2013-10-01', value: 1, count: 14},
    // {period: '2014-01-01', value: 0, count: 32},
    // {period: '2014-01-01', value: 1, count: 13},
    // {period: '2014-04-01', value: 0, count: 64},
    // {period: '2014-04-01', value: 1, count: 14},
    // {period: '2014-07-01', value: 0, count: 61},
    // {period: '2014-07-01', value: 1, count: 14},
    // {period: '2014-10-01', value: 0, count: 33},
    // {period: '2014-10-01', value: 1, count: 13},
    // {period: '2015-01-01', value: 0, count: 40},
    // {period: '2015-01-01', value: 1, count: 19},
    // {period: '2015-04-01', value: 0, count: 71},
    // {period: '2015-04-01', value: 1, count: 8},
    // {period: '2015-07-01', value: 0, count: 61},
    // {period: '2015-07-01', value: 1, count: 11},
    // {period: '2015-10-01', value: 0, count: 53},
    // {period: '2015-10-01', value: 1, count: 7},
    // {period: '2016-01-01', value: 0, count: 54},
    // {period: '2016-01-01', value: 1, count: 17},
    // {period: '2016-04-01', value: 0, count: 70},
    // {period: '2016-04-01', value: 1, count: 20},
    // {period: '2016-07-01', value: 0, count: 70},
    // {period: '2016-07-01', value: 1, count: 20},
    // {period: '2016-10-01', value: 0, count: 83},
    // {period: '2016-10-01', value: 1, count: 11},
    // {period: '2017-01-01', value: 0, count: 76},
    // {period: '2017-01-01', value: 1, count: 20},
    // {period: '2017-04-01', value: 0, count: 81},
    // {period: '2017-04-01', value: 1, count: 22},
    // {period: '2017-07-01', value: 0, count: 74},
    // {period: '2017-07-01', value: 1, count: 21},
    // {period: '2017-10-01', value: 0, count: 89},
    // {period: '2017-10-01', value: 1, count: 23},
    // {period: '2018-01-01', value: 0, count: 64},
    // {period: '2018-01-01', value: 1, count: 24},
    // {period: '2018-04-01', value: 0, count: 76},
    // {period: '2018-04-01', value: 1, count: 16},
    // {period: '2018-07-01', value: 0, count: 66},
    // {period: '2018-07-01', value: 1, count: 21},
    // {period: '2018-10-01', value: 0, count: 69},
    // {period: '2018-10-01', value: 1, count: 20}

    // {period: '2010-01-01', count: 1},
    // {period: '2012-10-01', count: 7},
    // {period: '2013-07-01', count: 5},
    // {period: '2014-01-01', count: 1},
    // {period: '2014-10-01', count: 3},
    // {period: '2015-04-01', count: 2},
    // {period: '2015-10-01', count: 4},
    // {period: '2016-01-01', count: 3},
    // {period: '2016-04-01', count: 1},
    // {period: '2018-07-01', count: 2},
    // {period: '2018-10-01', count: 1},

    {period: '2010-01-01', value: 'College degree', count: 2},
    {period: '2010-01-01', value: 'Graduated high school', count: 5},
    {period: '2010-01-01', value: 'High school - Not finished', count: 14},
    {period: '2010-01-01', value: 'Some college - No degree', count: 5},
    {period: '2010-04-01', value: '', count: 2},
    {period: '2010-04-01', value: 'College degree', count: 4},
    {period: '2010-04-01', value: 'Graduated high school', count: 16},
    {period: '2010-04-01', value: 'High school - Not finished', count: 12},
    {period: '2010-04-01', value: 'Post graduation degree (Masters, PHD, MD, etc.)', count: 2},
    {period: '2010-04-01', value: 'Some college - No degree', count: 5}
  ]

  tableData: TableData = EMPTY_TABLE_DATA;
  tableDataDirectory: TableDataDirectory = EMPTY_TABLE_DATA_DIRECTORY;
  datasets: Dataset[] = [];

  /**
   * Creates a pie or bar visualization based on variable type
   */
  constructor(
    readonly data: DataDistributionsState
  ) {
    this.spec = this.variable.type === 'Boolean' ? this.createPieSpec(this.variable, this.distributionData) : this.createBarSpec(this.variable, this.distributionData);
    this.timeSpec = this.createTimeSpec(this.distributionData);
  }

  /**
   * Creates pie graph visualization
   *
   * @param variable data for selected variable
   * @returns visualization
   */
  createPieSpec(variable: VariableData, distributionData: DistributionData[]): VisualizationSpec {
    return createPieSpec(variable, distributionData);
  }

  /**
   * Creates bar graph visualization
   *
   * @param variable data for selected variable
   * @returns visualization
   */
  createBarSpec(variable: VariableData, distributionData: DistributionData[]): VisualizationSpec {
    return createBarSpec(variable, distributionData);
  }

  createTimeSpec(distributionData: DistributionData[]): VisualizationSpec {
    return createTimeSpec(distributionData);
  }
}
