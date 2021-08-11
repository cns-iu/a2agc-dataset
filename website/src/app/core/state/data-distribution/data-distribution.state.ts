import { SummaryDistData } from './../../models/table-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Computed, DataAction, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { State } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { pluck, map } from 'rxjs/operators';
import { VisualizationSpec } from 'vega-embed';


import { EMPTY_TABLE_DATA_DIRECTORY, TableData, TableDataDirectory } from '../../models/table-data.model';
import { Dataset, DatasetColumn, DatasetColumns, DatasetSummary, EMPTY_DATASET } from './../../models/dataset.model';

interface DataDistributionsStateModel {
  datasets: Dataset[];
  currentDataset: Dataset;
  currentDataVariable: string;
  tableDataDirectory: TableDataDirectory;
  currentSpec?: VisualizationSpec;
  currentColumn?: DatasetColumn;
  currentColumnSummary?: DatasetSummary[];
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

  @Computed()
  get currentColumn$(): Observable<DatasetColumn | undefined> {
    return this.state$.pipe(pluck('currentColumn'));
  }

  @Computed()
  get currentColumnSummary$(): Observable<DatasetSummary[] | undefined> {
    return this.state$.pipe(pluck('currentColumnSummary'));
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
    const column = this.snapshot.currentDataset.columns[dataVariable];
    const columnSummary = this.getColumnSummary(column);

    if (spec && typeof spec === 'string') {
      spec = JSON.parse(spec as string);
    }

    this.ctx.patchState({
      currentDataVariable: dataVariable,
      currentSpec: spec,
      currentColumn: column,
      currentColumnSummary: columnSummary
    });
  }

  @DataAction()
  setCurrentDataset(dataset: Dataset): void {
    this.ctx.patchState({
      currentDataset: dataset
    });
  }

  public getColumnSummary(column: DatasetColumn): DatasetSummary[] {
    const summary: DatasetSummary[] = [];

    if (!column) {
      return summary;
    }

    summary.push({ label: 'Type', value: column.type });
    summary.push({ label: 'Description', value: column.remarks });
    summary.push({ label: 'Missing values', value: `${column.percentMissing}%` });

    if (column.distType === 'summary' && typeof (column.distData) !== 'string') {
      const distData: SummaryDistData = column.distData as SummaryDistData;
      summary.push({ label: 'Distinct entries', value: distData.distinct.toString() });
      summary.push({ label: 'Minimum value/length', value: distData.min.toString() });
      summary.push({ label: 'Maximum value/length', value: distData.max.toString() });
    }

    return summary;
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
    return Object.values(tableDataDirectory).map(data => this.tableDataToDataset(data));
  }

  private tableDataToDataset(tableData: TableData): Dataset {
    return {
      dataset: tableData.name,
      description: tableData.remarks ? tableData.remarks : '',
      dataVariables: this.getDataVariables(tableData, SUB_LABEL_FLAG, false),
      subLabel: this.getSubLabel(),
      subDataVariables: this.getDataVariables(tableData, SUB_LABEL_FLAG, true),
      specs: this.getDataSpecs(tableData),
      columns: this.getDatasetColumns(tableData)
    };
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

  private getDatasetColumns(tableData: TableData): DatasetColumns {
    return Object.entries(tableData.columns).reduce<DatasetColumns>((columns, [key, column]) => {
      columns[key] = {
        distData: column.dist_data ?? '',
        distType: column.dist_type,
        nonNullCount: column.n_non_null,
        name: column.name,
        percentMissing: column.pct_missing,
        remarks: column.remarks,
        type: column.type
      };

      return columns;
    }, {});
  }

  private getDataVariables(tableData: TableData, subLabelFlag: string, sub: boolean): string[] {
    // If requesting subDV but there is no sub label, return.
    if (sub && this.getSubLabel().length <= 0) {
      return [];
    }

    return Object.values(tableData.columns).reduce<string[]>((dv, column) => {
      const labelEquals = column.remarks === subLabelFlag;
      if (labelEquals === sub) {
        dv.push(column.name);
      }

      return dv;
    }, []);
  }

  private getSubLabel(): string {
    return SUB_LABEL;
  }
}
