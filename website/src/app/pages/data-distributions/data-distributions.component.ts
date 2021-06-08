import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { VisualizationSpec } from 'vega-embed';

import { createPieSpec, VariableData } from './data-distributions.vega';


@Component({
  selector: 'agc-data-distributions',
  templateUrl: './data-distributions.component.html',
  styleUrls: ['./data-distributions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataDistributionsComponent {
  @HostBinding('class') readonly clsName = 'data-schema-browser';

  readonly spec: VisualizationSpec;

  @Input() variable: VariableData = {
    dataset: 'Deaths',
    name: 'Cocaine',
    variableName: 'COCAINE',
    type: 'Boolean',
    description: 'Tox lab flag',
    missingValues: 0.0
  };

  constructor() { 
    this.spec = this.variable.type === 'Boolean' ? this.createPieSpec(this.variable) : this.createBarSpec(this.variable);
    console.log(this.spec)
  }

  createPieSpec(variable: VariableData): VisualizationSpec {
    return createPieSpec(variable);
  }

  createBarSpec(variable: VariableData): VisualizationSpec {
    return createPieSpec(variable); //replace with createBarSpec
  }
}