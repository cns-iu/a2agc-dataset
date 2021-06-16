import { EMPTY_TABLE_DATA_DIRECTORY, TableDataDirectory } from './../../models/table-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY_TABLE_DATA, TableData } from '../../models/table-data.model';

@Injectable({
  providedIn: 'root'
})
export class DataDistributionsService {
  private tableData: TableData = EMPTY_TABLE_DATA;
  private tableDataDirectory: TableDataDirectory = EMPTY_TABLE_DATA_DIRECTORY;

  constructor(private readonly http: HttpClient) { }

  async getCurrentTableData(): Promise<TableData> {
    if (this.tableData === EMPTY_TABLE_DATA) {
      const directory = await this.getTableDataDirectory();
      for (var prop in directory) {
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
    return await this.http.get('assets/generated/aggregate-table-data.json').toPromise() as TableDataDirectory;
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
}
