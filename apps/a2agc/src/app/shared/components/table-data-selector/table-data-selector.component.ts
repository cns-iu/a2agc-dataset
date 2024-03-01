import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

import { Dataset, DatasetVariable } from '../../../core/models/dataset.model';


/**
 * Dataset and variable selector for data distributions page
 */
@Component({
  selector: 'agc-table-data-selector',
  templateUrl: './table-data-selector.component.html',
  styleUrls: ['./table-data-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableDataSelectorComponent {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'agc-table-data-selector';

  /** Datasets available */
  @Input() datasets: Dataset[] = [];
  /** Variables for a dataset */
  @Input() variables: DatasetVariable[] = [];
  /** Subselector label */
  @Input() subLabel = '';
  /** Subselector variables */
  @Input() subVariables: DatasetVariable[] = [];

  /** Emits when selected dataset is changed */
  @Output() readonly datasetChange = new EventEmitter<Dataset>();
  /** Emits when selected dataset variable is changed */
  @Output() readonly dataVariableChange = new EventEmitter<DatasetVariable>();
  /** Emits when select all variables is toggled */
  @Output() readonly selectAll = new EventEmitter<void>();

  /** Selected dataset */
  selectedDataset: Dataset | undefined;
  /** Selected dataset variable */
  selectedVariable: DatasetVariable | undefined;

  /**
   * Gets list of variable names
   */
  get variableNames(): string[] {
    return this.variables.map(v => v.name);
  }

  /**
   * Gets list of subvariable names
   */
  get subVariableNames(): string[] {
    return this.subVariables.map(v => v.name);
  }

  /**
   * Sets selected dataset
   * @param dataset Dataset selected
   */
  setDataset(dataset: Dataset | undefined): void {
    if (dataset !== undefined && dataset !== this.selectedDataset) {
      this.selectedDataset = dataset;
      this.selectedVariable = undefined;
      this.datasetChange.emit(dataset);
    }
  }

  /**
   * Sets selected variable from the variable name and emits corresponding DatasetVariable
   * @param name variable name
   */
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
