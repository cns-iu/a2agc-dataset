import { Dataset } from './../../core/models/dataset.model';
import { TableDataDirectory, EMPTY_TABLE_DATA_DIRECTORY } from './../../core/models/table-data.model';
import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { EMPTY_TABLE_DATA, TableData } from 'src/app/core/models/table-data.model';
import { DataDistributionsService } from 'src/app/core/services/data-distributions/data-distributions.service';
import { VisualizationSpec } from 'vega-embed';

import { createPieSpec, VariableData } from './data-distributions.vega';


/**
 * Component
 */
@Component({
  selector: 'agc-data-distributions',
  templateUrl: './data-distributions.component.html',
  styleUrls: ['./data-distributions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    private readonly dataService: DataDistributionsService
  ) {
    this.spec = this.variable.type === 'Boolean' ? this.createPieSpec(this.variable) : this.createBarSpec(this.variable);
  }

  async ngOnInit(): Promise<void> {
    this.tableDataDirectory = await this.dataService.getTableDataDirectory();
    this.tableData = await this.dataService.getCurrentTableData();
    this.datasets = this.tableDataDirectoryToDatasets(this.tableDataDirectory);

    console.log('datasets: ', this.datasets);
    console.log('tabledatadirectory: ', this.tableDataDirectory, '\ntabledata: ', this.tableData);
  }

  tableDataDirectoryToDatasets(tableDataDirectory: TableDataDirectory): Dataset[] {
    const datasets: Dataset[] = [];

    for (let prop in tableDataDirectory) {
      datasets.push(this.tableDataToDataset(tableDataDirectory[prop]));
    }

    return datasets;
  }

  tableDataToDataset(tableData: TableData): Dataset {
    // TODO:  Move this constant out.
    const SUB_LABEL_FLAG = 'Tox lab flag';
    let dataset: Dataset = {} as Dataset;

    dataset.dataset = tableData.name;
    dataset.description = tableData.remarks ? tableData.remarks : '';
    dataset.dataVariables = this.getColumnsFromTableData(tableData, SUB_LABEL_FLAG);
    dataset.subLabel = this.getSubLabel(tableData);
    dataset.subDataVariables =  this.getSubDataVariablesFromTableData(tableData, SUB_LABEL_FLAG);

    return dataset;
  }

  getColumnsFromTableData(tableData: TableData, subLabelFlag: string): string[] {
    let columns: string[] = [];

    for (let prop in tableData.columns) {
      if (tableData.columns[prop].remarks !== subLabelFlag) {
        let newColumn = prop;
        columns.push(newColumn);
      }
    }

    return columns;
  }

  getSubDataVariablesFromTableData(tableData: TableData,  subLabelFlag: string): string[] {
    let subDataVariables: string[] = [];

    if (this.getSubLabel(tableData).length <= 0) {
      return subDataVariables;
    }

    for (let prop in tableData.columns) {
      if (tableData.columns[prop].remarks === subLabelFlag) {
        let newVariable = tableData.columns[prop].name;
        subDataVariables.push(newVariable);
      }
    }

    return subDataVariables;
  }

  getSubLabel(tableData: TableData): string {
    return 'Drug';
  }

  cleanText(text: string): string {
    let cleanText = '';

    let words = text.split('_');
    let cleanWord = '';
    for (let i = 0; i < words.length; i++) {
      cleanWord = words[i].toLowerCase();
      cleanWord = cleanWord.charAt(0).toUpperCase() + text.slice(1);
      cleanText += cleanWord;
      cleanWord = '';

      if (i < (words.length - 1)) {
        cleanText += ' ';
      }
    }
    console.log('text: ', text, '\ncleanText: ', cleanText);

    return cleanText;
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
