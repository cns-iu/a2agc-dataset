import { Dataset } from 'src/app/core/models/dataset.model';
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

  dataset: Dataset[] = [
    {
      dataset: 'Cars',
      dataVariables: [
        'Transmission',
        'Seats',
        'Doors',
        'Year'
      ],
      description: 'Cars lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      subLabel: 'Make',
      subDataVariables: [
        'Ford',
        'Chevy',
        'Tesla',
        'Audi'
      ]
    },
    {
      dataset: 'Computers',
      dataVariables: [
        'CPU',
        'GPU',
        'PSU',
        'Memory',
        'OS'
      ]
    },
    {
      dataset: 'Dogs',
      dataVariables: [
        'Age',
        'Fur',
        'Energy Level'
      ],
      description: 'Dogs lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.',
      subLabel: 'Breed',
      subDataVariables: [
        'Husky',
        'Beagle',
        'Golden Retriever'
      ]
    }
  ]

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

  handleDatasetChange(dataset: Dataset): void {
  }

  handleDataVariableChange(variable: string): void {
  }
}
