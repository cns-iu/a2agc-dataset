import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

import { Dataset, DatasetVariable } from '../../../core/models/dataset.model';


@Component({
  selector: 'agc-table-data-selector',
  templateUrl: './table-data-selector.component.html',
  styleUrls: ['./table-data-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableDataSelectorComponent {
  @HostBinding('class') readonly clsName = 'agc-table-data-selector';

  @Input() datasets: Dataset[] = [];
  @Input() variables: DatasetVariable[] = [];
  @Input() subLabel = '';
  @Input() subVariables: DatasetVariable[] = [];

  @Output() readonly datasetChange = new EventEmitter<Dataset>();
  @Output() readonly dataVariableChange = new EventEmitter<DatasetVariable>();
  @Output() readonly selectAll = new EventEmitter<void>();

  selectedDataset: Dataset | undefined;
  selectedVariable: DatasetVariable | undefined;

  get variableNames(): string[] {
    return this.variables.map(v => v.name);
  }

  get subVariableNames(): string[] {
    return this.subVariables.map(v => v.name);
  }

  setDataset(dataset: Dataset | undefined): void {
    if (dataset !== undefined) {
      this.selectedDataset = dataset;
      this.datasetChange.emit(dataset);
    }
  }

  setVariableFromName(name: string): void {
    if (this.selectedDataset !== undefined) {
      const variable = this.variables.find(v => v.name === name) ??
        this.subVariables.find(v => v.name === name);

      if (variable?.dataset === this.selectedDataset.name) {
        this.selectedVariable = variable;
        this.dataVariableChange.emit(variable);
      }
    }
  }
}
