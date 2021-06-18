import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Computed, DataAction, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { State } from '@ngxs/store';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { EMPTY_TABLE_DATA_DIRECTORY, TableData, TableDataDirectory } from '../../models/table-data.model';
import { Dataset, EMPTY_DATASET } from './../../models/dataset.model';

interface DataDistributionsStateModel {
  datasets: Dataset[];
  currentDataset: Dataset;
  currentDataVariable: string;
  tableDataDirectory: TableDataDirectory;
}

const DISTRIBUTIONS_CONFIG_PATH = 'assets/generated/aggregate-table-data.json';
const SUB_LABEL_FLAG = 'Tox lab flag';
const SUB_LABEL = 'Drug';

@StateRepository()
@State<DataDistributionsStateModel>({
  name: 'dataDistributions',
  defaults: {
    datasets: [],
    currentDataset: EMPTY_DATASET,
    currentDataVariable: '',
    tableDataDirectory: EMPTY_TABLE_DATA_DIRECTORY
  }
})
@Injectable()
export class DataDistributionsState extends NgxsDataRepository<DataDistributionsStateModel> {
  @Computed()
  get datasets$(): Observable<Dataset[]> {
    return this.state$.pipe(pluck('datasets'));
  }

  @Computed()
  get currentDataset$(): Observable<Dataset> {
    return this.state$.pipe(pluck('currentDataset'));
  }

  @Computed()
  get currentDataVariable$(): Observable<string> {
    return this.state$.pipe(pluck('currentDataVariable'));
  }

  @Computed()
  get tableDataDirectory$(): Observable<TableDataDirectory> {
    return this.state$.pipe(pluck('tableDataDirectory'));
  }

  constructor(private readonly http: HttpClient) {
    super();
  }

  async ngxsOnInit(): Promise<void> {
    super.ngxsOnInit();
    const datasets: Dataset[] = await this.getDatasets();
    const tableDataDirectory: TableDataDirectory = await this.getTableDataDirectory();
    this.patchState({ datasets, tableDataDirectory });
  }

  @DataAction()
  setCurrentDataVariable(dataVariable: string): void {
    this.ctx.patchState({
      currentDataVariable: dataVariable
    });
  }

  @DataAction()
  setCurrentDataset(dataset: Dataset): void {
    this.ctx.patchState({
      currentDataset: Object.assign({}, dataset)
    });
  }

  @DataAction()
  setTableDataDirectory(directory: TableDataDirectory): void {
    this.ctx.patchState({
      tableDataDirectory: Object.assign({}, directory)
    });
  }

  private async fetchTableDataDirectory(): Promise<TableDataDirectory> {
    return await this.http.get(DISTRIBUTIONS_CONFIG_PATH).toPromise() as TableDataDirectory;
  }

  private async getTableDataDirectory(): Promise<TableDataDirectory> {
    if (this.snapshot.tableDataDirectory === EMPTY_TABLE_DATA_DIRECTORY) {
      const directory = await this.fetchTableDataDirectory();
      return directory;
    }
    return {...this.snapshot.tableDataDirectory};
  }

  private async getDatasets(): Promise<Dataset[]> {
    const tableDataDirectory = await this.getTableDataDirectory();
    const datasets = this.tableDataDirectoryToDatasets(tableDataDirectory);
    return datasets;
  }

  private tableDataDirectoryToDatasets(tableDataDirectory: TableDataDirectory): Dataset[] {
    const datasets: Dataset[] = [];

    for (const prop in tableDataDirectory) {
      datasets.push(this.tableDataToDataset(tableDataDirectory[prop]));
    }

    return datasets;
  }

  private tableDataToDataset(tableData: TableData): Dataset {
    const dataset: Dataset = {
      dataset: tableData.name,
      description: tableData.remarks ? tableData.remarks : '',
      dataVariables: this.getColumnsFromTableData(tableData, SUB_LABEL_FLAG),
      subLabel: this.getSubLabel(),
      subDataVariables: this.getSubDataVariablesFromTableData(tableData, SUB_LABEL_FLAG)
    }

    return dataset;
  }

  private getColumnsFromTableData(tableData: TableData, subLabelFlag: string): string[] {
    const columns: string[] = [];

    for (const prop in tableData.columns) {
      if (tableData.columns[prop].remarks !== subLabelFlag) {
        const newColumn = prop;
        columns.push(newColumn);
      }
    }

    return columns;
  }

  private getSubDataVariablesFromTableData(tableData: TableData, subLabelFlag: string): string[] {
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

  private getSubLabel(): string {
    return SUB_LABEL;
  }
}
