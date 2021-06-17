import { Dataset } from './../../core/models/dataset.model';
import { TableDataDirectory, EMPTY_TABLE_DATA_DIRECTORY } from './../../core/models/table-data.model';
import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { EMPTY_TABLE_DATA, TableData } from 'src/app/core/models/table-data.model';
import { DataDistributionsService } from 'src/app/core/services/data-distributions/data-distributions.service';
import { VisualizationSpec } from 'vega-embed';

import { createPieSpec, VariableData } from './data-distributions.vega';
import { DataDistributionsState } from 'src/app/core/state/data-distribution/data-distribution.state';


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
export class DataDistributionsComponent implements OnInit {
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
    dataset: 'Deaths',
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
    private readonly dataService: DataDistributionsService,
    readonly data: DataDistributionsState
  ) {
    this.spec = this.variable.type === 'Boolean' ? this.createPieSpec(this.variable) : this.createBarSpec(this.variable);
  }

  async ngOnInit(): Promise<void> {
    this.datasets = await this.dataService.getDatasets();
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
