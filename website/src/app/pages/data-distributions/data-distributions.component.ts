import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { VisualizationSpec } from 'vega-embed';

import { createPieSpec, VariableData } from './data-distributions.vega';


/**
 * Component
 */
@Component({
  selector: 'agc-data-distributions',
  templateUrl: './data-distributions.component.html',
  styleUrls: ['./data-distributions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataDistributionsComponent {
  /**
   * HTML class name
   */
  @HostBinding('class') readonly clsName = 'data-schema-browser';

  /**
   * Vega-lite spec to be displayed
   */
  readonly spec: VisualizationSpec;

  /**
   * Metadata for the selected variable
   */
  @Input() variable: VariableData = {
    dataset: 'Deaths',
    name: 'Cocaine',
    variableName: 'COCAINE',
    type: 'Boolean',
    description: 'Tox lab flag',
    missingValues: 0.0
  };

  /**
   * Creates a pie or bar visualization based on variable type
   */
  constructor() {
    this.spec = this.variable.type === 'Boolean' ? this.createPieSpec(this.variable) : this.createBarSpec(this.variable);
  }

  /**
   * Creates pie graph visualization
   *
   * @param variable data for selected variable
   * @returns visualization
   */
  createPieSpec(variable: VariableData): VisualizationSpec {
    return createPieSpec(variable);
  }

  /**
   * Creates bar graph visualization
   *
   * @param variable data for selected variable
   * @returns visualization
   */
  createBarSpec(variable: VariableData): VisualizationSpec {
    return createPieSpec(variable); //replace with createBarSpec
  }
}
