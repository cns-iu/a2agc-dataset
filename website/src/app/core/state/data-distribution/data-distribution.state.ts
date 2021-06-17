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
}

const SUB_LABEL_FLAG = 'Tox lab flag';
const ASSETS_DIRECTORY = 'assets/generated/aggregate-table-data.json';
const SUB_LABEL = 'Drug';

@StateRepository()
@State<DataDistributionsStateModel>({
  name: 'page',
  defaults: {
    datasets: [],
    currentDataset: EMPTY_DATASET
  }
})
@Injectable()
export class DataDistributionsState extends NgxsDataRepository<DataDistributionsStateModel> {
  private tableData: TableData = EMPTY_TABLE_DATA;
  private tableDataDirectory: TableDataDirectory = EMPTY_TABLE_DATA_DIRECTORY;

  @Computed()
  get datasets$(): Observable<Dataset[]> {
    return this.state$.pipe(pluck('datasets'));
  }

  @Computed()
  get currentDataset$(): Observable<Dataset> {
    return this.state$.pipe(pluck('currentDataset'));
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
    return await this.http.get(ASSETS_DIRECTORY).toPromise() as TableDataDirectory;
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

    for (let prop in tableDataDirectory) {
      datasets.push(this.tableDataToDataset(tableDataDirectory[prop]));
    }

    return datasets;
  }

  tableDataToDataset(tableData: TableData): Dataset {
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
    return SUB_LABEL;
  }
}
