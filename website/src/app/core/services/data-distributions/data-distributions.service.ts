import { EMPTY_DATASET } from './../../models/dataset.model';
import { EMPTY_TABLE_DATA_DIRECTORY, TableDataDirectory } from './../../models/table-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY_TABLE_DATA, TableData } from '../../models/table-data.model';
import { Dataset } from '../../models/dataset.model';

const SUB_LABEL_FLAG = 'Tox lab flag';
const ASSETS_DIRECTORY = 'assets/generated/aggregate-table-data.json';
const SUB_LABEL = 'Drug';

@Injectable({
  providedIn: 'root'
})
export class DataDistributionsService {
  private tableData: TableData = EMPTY_TABLE_DATA;
  private tableDataDirectory: TableDataDirectory = EMPTY_TABLE_DATA_DIRECTORY;
  private datasets: Dataset[] = [];

  constructor(private readonly http: HttpClient) { }

  async getCurrentTableData(): Promise<TableData> {
    if (this.tableData === EMPTY_TABLE_DATA) {
      const directory = await this.getTableDataDirectory();
      for (const prop in directory) {
        this.tableData = directory[prop];
        break;
      }
    }
    return {...this.tableData};
  }

  async getTableDataDirectory(): Promise<TableDataDirectory> {
    if (this.tableDataDirectory === EMPTY_TABLE_DATA_DIRECTORY) {
      const directory = await this.fetchTableDataDirectory();
      this.tableDataDirectory = directory;
    }
    return {...this.tableDataDirectory};
  }

  async fetchTableDataDirectory(): Promise<TableDataDirectory> {
    return await this.http.get(ASSETS_DIRECTORY).toPromise() as TableDataDirectory;
  }

  async getTableData(key: string): Promise<TableData> {
    const directory: TableDataDirectory = await this.getTableDataDirectory();
    if (directory[key]) {
      return directory[key];
    }

    return EMPTY_TABLE_DATA;
  }

  async setCurrentDataset(key: string): Promise<void> {
    this.tableData = await this.getTableData(key);
  }

  async getDatasets(): Promise<Dataset[]> {
    if (this.datasets.length > 0) {
      return this.datasets;
    }

    const tableDataDirectory = await this.getTableDataDirectory();
    this.datasets = this.tableDataDirectoryToDatasets(tableDataDirectory);
    return this.datasets;
  }

  tableDataDirectoryToDatasets(tableDataDirectory: TableDataDirectory): Dataset[] {
    const datasets: Dataset[] = [];

    for (const prop in tableDataDirectory) {
      datasets.push(this.tableDataToDataset(tableDataDirectory[prop]));
    }

    return datasets;
  }

  tableDataToDataset(tableData: TableData): Dataset {
    const dataset: Dataset = EMPTY_DATASET;

    dataset.dataset = tableData.name;
    dataset.description = tableData.remarks ? tableData.remarks : '';
    dataset.dataVariables = this.getColumnsFromTableData(tableData, SUB_LABEL_FLAG);
    dataset.subLabel = this.getSubLabel();
    dataset.subDataVariables = this.getSubDataVariablesFromTableData(tableData, SUB_LABEL_FLAG);

    return dataset;
  }

  getColumnsFromTableData(tableData: TableData, subLabelFlag: string): string[] {
    const columns: string[] = [];

    for (const prop in tableData.columns) {
      if (tableData.columns[prop].remarks !== subLabelFlag) {
        const newColumn = prop;
        columns.push(newColumn);
      }
    }

    return columns;
  }

  getSubDataVariablesFromTableData(tableData: TableData, subLabelFlag: string): string[] {
    const subDataVariables: string[] = [];

    if (this.getSubLabel().length <= 0) {
      return subDataVariables;
    }

    for (const prop in tableData.columns) {
      if (tableData.columns[prop].remarks === subLabelFlag) {
        const newVariable = tableData.columns[prop].name;
        subDataVariables.push(newVariable);
      }
    }

    return subDataVariables;
  }

  getSubLabel(): string {
    return SUB_LABEL;
  }
}
