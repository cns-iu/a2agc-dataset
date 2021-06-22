import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { EMPTY_TABLE_DATA, TableData } from 'src/app/core/models/table-data.model';
import { DataDistributionsState } from 'src/app/core/state/data-distribution/data-distribution.state';
import { VisualizationSpec } from 'vega-embed';

import { Dataset } from './../../core/models/dataset.model';
import { EMPTY_TABLE_DATA_DIRECTORY, TableDataDirectory } from './../../core/models/table-data.model';
import { createPieSpec, VariableData } from './data-distributions.vega';


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

  tableData: TableData = EMPTY_TABLE_DATA;
  tableDataDirectory: TableDataDirectory = EMPTY_TABLE_DATA_DIRECTORY;
  datasets: Dataset[] = [];

  /**
   * Metadata for the selected variable
   */
  @Input() variable: VariableData = {
    dataset: 'deaths',
    name: 'Cocaine',
    variableName: 'COCAINE_AMOUNT',
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
    this.spec = this.variable.type === 'Boolean' ? this.createPieSpec(this.variable) : this.createBarSpec(this.variable);
  }

  /**
   * Creates pie graph visualization
   *
   * @param variable data for selected variable
   * @returns visualization
   */
  createPieSpec(variable: VariableData): VisualizationSpec {
    return createPieSpec(variable);
  }

  /**
   * Creates bar graph visualization
   *
   * @param variable data for selected variable
   * @returns visualization
   */
  createBarSpec(variable: VariableData): VisualizationSpec {
    return createPieSpec(variable); //replace with createBarSpec
  }
}
