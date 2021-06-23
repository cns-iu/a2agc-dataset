import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Computed, DataAction, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { State } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { pluck, map } from 'rxjs/operators';
import { VisualizationSpec } from 'vega-embed';


import { EMPTY_TABLE_DATA_DIRECTORY, TableData, TableDataDirectory } from '../../models/table-data.model';
import { Dataset, EMPTY_DATASET } from './../../models/dataset.model';

interface DataDistributionsStateModel {
  datasets: Dataset[];
  currentDataset: Dataset;
  currentDataVariable: string;
  tableDataDirectory: TableDataDirectory;
  currentSpec?: VisualizationSpec;
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
  get tableDataDirectory$(): Observable<TableDataDirectory> {
    return this.state$.pipe(pluck('tableDataDirectory'));
  }

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
  get currentSpec$(): Observable<VisualizationSpec | undefined> {
    return this.state$.pipe(pluck('currentSpec'));
  }

  constructor(private readonly http: HttpClient) {
    super();
  }

  ngxsOnInit(): void {
    super.ngxsOnInit();

    this.getDatasets().subscribe(datasets => this.setDatasets(datasets));
    this.getTableDataDirectory().subscribe(tableDataDirectory => this.setTableDataDirectory(tableDataDirectory));
  }

  @DataAction()
  setTableDataDirectory(directory: TableDataDirectory): void {
    this.ctx.patchState({
      tableDataDirectory: directory
    });
  }

  @DataAction()
  setDatasets(datasets: Dataset[]): void {
    this.ctx.patchState({
      datasets
    });
  }

  @DataAction()
  setCurrentDataVariable(dataVariable: string): void {
    let spec = this.snapshot.currentDataset.specs[dataVariable];

    if (spec && typeof spec === 'string') {
      spec = JSON.parse(spec as string);
    }

    this.ctx.patchState({
      currentDataVariable: dataVariable,
      currentSpec: spec
    });
  }

  @DataAction()
  setCurrentDataset(dataset: Dataset): void {
    this.ctx.patchState({
      currentDataset: dataset
    });
  }

  private getTableDataDirectory(): Observable<TableDataDirectory> {
    if (this.snapshot.tableDataDirectory === EMPTY_TABLE_DATA_DIRECTORY) {
      return this.fetchTableDataDirectory();
    }
    return of({ ...this.snapshot.tableDataDirectory });
  }

  private fetchTableDataDirectory(): Observable<TableDataDirectory> {
    return this.http.get<TableDataDirectory>(DISTRIBUTIONS_CONFIG_PATH);
  }

  private getDatasets(): Observable<Dataset[]> {
    return this.getTableDataDirectory().pipe(map((dir: TableDataDirectory) => this.tableDataDirectoryToDatasets(dir)));
  }

  private tableDataDirectoryToDatasets(tableDataDirectory: TableDataDirectory): Dataset[] {
    const datasets: Dataset[] = [];

    for (const prop in tableDataDirectory) {
      datasets.push(this.tableDataToDataset(tableDataDirectory[prop]));
    }

    return datasets;
  }

  private tableDataToDataset(tableData: TableData): Dataset {
    return {
      dataset: tableData.name,
      description: tableData.remarks ? tableData.remarks : '',
      dataVariables: this.getColumnsFromTableData(tableData, SUB_LABEL_FLAG),
      subLabel: this.getSubLabel(),
      subDataVariables: this.getSubDataVariablesFromTableData(tableData, SUB_LABEL_FLAG),
      specs: this.getDataSpecs(tableData)
    }
  }

  private getDataSpecs(tableData: TableData): { [dataVariable: string]: VisualizationSpec } {
    const specs: { [dataVariable: string]: VisualizationSpec } = {};
    const columns = tableData.columns;
    for (const column in columns) {
      if (columns[column].dist_data !== undefined) {
        specs[column] = columns[column].dist_data as VisualizationSpec;
      }
    }
    return specs;
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
