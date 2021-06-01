import { Component, HostBinding, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

interface DataVariables {
  [key:string]: string[]
}

@Component({
  selector: 'agc-table-data-selector',
  templateUrl: './table-data-selector.component.html',
  styleUrls: ['./table-data-selector.component.scss']
})
export class TableDataSelectorComponent implements OnInit {
  @HostBinding('class') readonly clsName = 'agc-visualization-page';

  @Input() datasets: string[] = ['Fruit', 'Cars', 'Computers'];
  @Input() dataVariables: DataVariables = {
    'Fruit': [
      'Apple',
      'Banana',
      'Strawberry'
    ],
    'Cars': [
      'Corvette',
      'Mustang',
      'Tesla'
    ],
    'Computers': [
      'GPU',
      'CPU',
      'PSU'
    ]
  };
  @Input() selectedDataset = '';
  @Input() selectedDataVariable = '';

  @Output() datasetChange = new EventEmitter<string>();
  @Output() dataVariableChange = new EventEmitter<string>();

  ngOnInit(): void {
    this.selectedDataset = this.datasets[0];
    this.selectedDataVariable = this.dataVariables[this.selectedDataset][0];
  }

  getCurrentDataVariables(): string[] {
    return this.dataVariables[this.selectedDataset];
  }

  handleDatasetChange(event: MatSelectChange): void {
    this.datasetChange.emit(event.value);
  }

  handleDataVariableChange(event: MatSelectChange): void {
    this.dataVariableChange.emit(event.value);
  }
}
