import { Component, HostBinding, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Dataset } from 'src/app/core/models/dataset.model';

@Component({
  selector: 'agc-table-data-selector',
  templateUrl: './table-data-selector.component.html',
  styleUrls: ['./table-data-selector.component.scss']
})
export class TableDataSelectorComponent {
  @HostBinding('class') readonly clsName = 'agc-table-data-selector';

  @Input() datasets!: Dataset[];
  @Input() selectedDatasetIndex: number | undefined;
  @Input() selectedDataVariable: string | undefined;

  @Output() datasetChange = new EventEmitter<Dataset>();
  @Output() dataVariableChange = new EventEmitter<string>();

  getCurrentDataVariables(): string[] {
    if (this.selectedDatasetIndex === undefined || this.selectedDatasetIndex < 0) {
      return [];
    }

    return this.datasets[this.selectedDatasetIndex]?.dataVariables;
  }

  handleDatasetChange(event: MatSelectChange): void {
    const selectedDatasetIndex = this.datasets[event.value];
    this.datasetChange.emit(selectedDatasetIndex);
  }

  handleDataVariableChange(event: MatSelectChange): void {
    this.dataVariableChange.emit(event.value);
  }
}
