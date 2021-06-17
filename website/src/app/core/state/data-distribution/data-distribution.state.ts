import { HttpClient } from '@angular/common/http';
import { Dataset, EMPTY_DATASET } from './../../models/dataset.model';
import { Injectable } from '@angular/core';
import { Computed, DataAction, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { State } from '@ngxs/store';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { EMPTY_TABLE_DATA, EMPTY_TABLE_DATA_DIRECTORY, TableData, TableDataDirectory } from '../../models/table-data.model';

interface DataDistributionsStateModel {
  datasets: Dataset[];
  currentDataset: Dataset;
  currentDataVariable: string;
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
    currentDataVariable: ''
  }
})
@Injectable()
export class DataDistributionsState extends NgxsDataRepository<DataDistributionsStateModel> {
  private tableDataDirectory: TableDataDirectory = EMPTY_TABLE_DATA_DIRECTORY;

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

  constructor(private readonly http: HttpClient) {
    super();
  }

  async ngxsOnInit(): Promise<void> {
    super.ngxsOnInit();
    const datasets: Dataset[] = await this.getDatasets();
    this.patchState({ datasets });
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

  async getTableDataDirectory(): Promise<TableDataDirectory> {
    if (this.tableDataDirectory === EMPTY_TABLE_DATA_DIRECTORY) {
      const directory = await this.fetchTableDataDirectory();
      this.tableDataDirectory = directory;
    }
    return {...this.tableDataDirectory};
  }

  async fetchTableDataDirectory(): Promise<TableDataDirectory> {
    return await this.http.get(DISTRIBUTIONS_CONFIG_PATH).toPromise() as TableDataDirectory;
  }

  async getTableData(key: string): Promise<TableData> {
    const directory: TableDataDirectory = await this.getTableDataDirectory();
    if (directory[key]) {
      return directory[key];
    }

    return EMPTY_TABLE_DATA;
  }

  async getDatasets(): Promise<Dataset[]> {
    const tableDataDirectory = await this.getTableDataDirectory();
    const datasets = this.tableDataDirectoryToDatasets(tableDataDirectory);
    return datasets;
  }

  tableDataDirectoryToDatasets(tableDataDirectory: TableDataDirectory): Dataset[] {
    const datasets: Dataset[] = [];

    for (const prop in tableDataDirectory) {
      datasets.push(this.tableDataToDataset(tableDataDirectory[prop]));
    }

    return datasets;
  }

  tableDataToDataset(tableData: TableData): Dataset {
    const dataset: Dataset = {
      dataset: tableData.name,
      description: tableData.remarks ? tableData.remarks : '',
      dataVariables: this.getColumnsFromTableData(tableData, SUB_LABEL_FLAG),
      subLabel: this.getSubLabel(),
      subDataVariables: this.getSubDataVariablesFromTableData(tableData, SUB_LABEL_FLAG)
    }

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
