import { EMPTY_DATASET } from './../../../core/models/dataset.model';
import { Component, HostBinding, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Dataset } from 'src/app/core/models/dataset.model';

@Component({
  selector: 'agc-table-data-selector',
  templateUrl: './table-data-selector.component.html',
  styleUrls: ['./table-data-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableDataSelectorComponent {
  @HostBinding('class') readonly clsName = 'agc-table-data-selector';

  @Input() datasets: Dataset[] | null = [];
  @Output() readonly datasetChange = new EventEmitter<Dataset>();
  @Output() readonly dataVariableChange = new EventEmitter<string>();

  selectedDataVariable: string | undefined;
  currentDataset: Dataset | undefined;

  get selectedDataset(): Dataset {
    if (!this.currentDataset) {
      return EMPTY_DATASET;
    }

    return this.currentDataset;
  }

  get subDataVariables(): string[] {
    if (!this.selectedDataset.subDataVariables) {
      return [];
    }

    return this.selectedDataset.subDataVariables;
  }

  get subLabel(): string {
    if (!this.selectedDataset.subLabel){
      return '';
    }

    return this.selectedDataset.subLabel;
  }

  handleDatasetChange(event: MatSelectChange): void {
    const newIndex = event.value;
    this.setCurrentDatasetIndex(newIndex);
  }

  dataVariableIsValid(dataset: Dataset, dataVariable: string): boolean {
    if (dataset.dataVariables.indexOf(dataVariable) >= 0) {
      return true;
    }

    if (dataset.subDataVariables) {
      if (dataset.subDataVariables.indexOf(dataVariable) >= 0) {
        return true;
      }
    }

    return false;
  }

  setDataVariable(dataVariable: string): void {
    if (!this.selectedDataset) {
      return;
    }

    if (!this.dataVariableIsValid(this.selectedDataset, dataVariable)) {
      return;
    }

    this.selectedDataVariable = dataVariable;
    this.dataVariableChange.emit(dataVariable);
  }

  setCurrentDatasetIndex(index: number): void {
    if (!this.datasets) {
      return;
    }

    if (!this.datasets[index]) {
      return;
    }

    this.currentDataset = this.datasets[index];
    this.datasetChange.emit(this.currentDataset);
  }

  setCurrentDataset(dataset: Dataset): void {
    if (!this.datasets) {
      return;
    }

    if (this.datasets.indexOf(dataset) < 0) {
      return;
    }

    const newIndex = this.datasets.indexOf(dataset);
    this.setCurrentDatasetIndex(newIndex);
  }
}
