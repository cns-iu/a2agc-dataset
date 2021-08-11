import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { EMPTY_TABLE_DATA, TableData } from 'src/app/core/models/table-data.model';
import { DataDistributionsState } from 'src/app/core/state/data-distribution/data-distribution.state';
import { VisualizationSpec } from 'vega-embed';

import { Dataset } from './../../core/models/dataset.model';
import { EMPTY_TABLE_DATA_DIRECTORY, TableDataDirectory } from './../../core/models/table-data.model';
import { createPieSpec, createTimeSpec, VariableData } from './data-distributions.vega';


/**
 * Component
 */
@Component({
  selector: 'agc-data-distributions',
  templateUrl: './data-distributions.component.html',
  styleUrls: ['./data-distributions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DataDistributionsState]
})
export class DataDistributionsComponent {
  /**
   * HTML class name
   */
  @HostBinding('class') readonly clsName = 'data-schema-browser';

  /**
   * Vega-lite spec to be displayed
   */
  readonly spec: VisualizationSpec;

  readonly timeSpec: VisualizationSpec;

  readonly dataset = 'assets/generated/visualization5/data.csv';

  readonly periodDataset = [
    {CASE_NUMBER: '120638', Touchpoint_A: '3', Touchpoint_B: '3', PERIOD: '2012-4-1', Set: 'Rx + Health', True: '1'},
    {CASE_NUMBER: '120638', Touchpoint_A: '3', Touchpoint_B: '3', PERIOD: '2012-4-1', Set: 'Rx + Health', True: '1'},
    {CASE_NUMBER: '150270', Touchpoint_A: '0', Touchpoint_B: '3', PERIOD: '2015-1-1', Set: 'Health', True: '1'},
    {CASE_NUMBER: '170545', Touchpoint_A: '0', Touchpoint_B: '2', PERIOD: '2017-1-1', Set: 'Jail + Health', True: '1'},
  ]

  tableData: TableData = EMPTY_TABLE_DATA;
  tableDataDirectory: TableDataDirectory = EMPTY_TABLE_DATA_DIRECTORY;
  datasets: Dataset[] = [];

  /**
   * Metadata for the selected variable
   */
  @Input() variable: VariableData = {
    dataset: 'deaths',
    name: 'Cocaine',
    variableName: 'COCAINE',
    type: 'Boolean',
    description: 'Tox lab flag',
    missingValues: 0.0
  };

  /**
   * Creates a pie or bar visualization based on variable type
   */
  constructor(
    readonly data: DataDistributionsState
  ) {
    this.spec = this.variable.type === 'Boolean' ? this.createPieSpec(this.variable, this.periodDataset) : this.createBarSpec(this.variable, this.periodDataset);
    this.timeSpec = this.createTimeSpec(this.periodDataset);
  }

  /**
   * Creates pie graph visualization
   *
   * @param variable data for selected variable
   * @returns visualization
   */
  createPieSpec(variable: VariableData, periodDataset: any): VisualizationSpec {
    return createPieSpec(variable, periodDataset);
  }

  /**
   * Creates bar graph visualization
   *
   * @param variable data for selected variable
   * @returns visualization
   */
  createBarSpec(variable: VariableData, period: any): VisualizationSpec {
    return createPieSpec(variable, period); //replace with createBarSpec
  }

  createTimeSpec(periodDataset: any): VisualizationSpec {
    return createTimeSpec(periodDataset);
  }
}
