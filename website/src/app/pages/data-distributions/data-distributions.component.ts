import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { EMPTY_TABLE_DATA, TableData } from 'src/app/core/models/table-data.model';
import { DataDistributionsState } from 'src/app/core/state/data-distribution/data-distribution.state';

import { Dataset } from './../../core/models/dataset.model';
import { EMPTY_TABLE_DATA_DIRECTORY, TableDataDirectory } from './../../core/models/table-data.model';
import { createDemoPieSpec, createDemoBarSpec, createDemoHorizBarSpec, createDemoTimeSpec } from './charts/demo';

export interface VariableData {
  dataset: string;
  name: string;
  variableName: string;
  type: string;
  description: string;
  missingValues: number;
  xLabel?: string;
  yLabel?: string;
}

export interface DistributionData {
  period?: string;
  value: string | number;
  count: number;
}

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
    dataset: 'Deaths',
    name: 'Cocaine',
    variableName: 'COCAINE',
    type: 'Boolean',
    description: 'Tox lab flag',
    missingValues: 0.0
  };

  /**
   * Vega-lite spec to be displayed
   */
  readonly demoPieSpec = createDemoPieSpec();

  readonly demoBarChartSpec = createDemoBarSpec();

  readonly demoHorizBarChartSpec = createDemoHorizBarSpec();

  readonly timeSpec = createDemoTimeSpec();

  tableData: TableData = EMPTY_TABLE_DATA;
  tableDataDirectory: TableDataDirectory = EMPTY_TABLE_DATA_DIRECTORY;
  datasets: Dataset[] = [];

  /**
   * Creates a pie or bar visualization based on variable type
   */
  constructor(readonly data: DataDistributionsState) { }
}
