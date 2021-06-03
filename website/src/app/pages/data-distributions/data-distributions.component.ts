import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { Dataset } from 'src/app/core/models/dataset.model';


@Component({
  selector: 'agc-data-distributions',
  templateUrl: './data-distributions.component.html',
  styleUrls: ['./data-distributions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataDistributionsComponent {
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

  handleDatasetChange(dataset: Dataset): void {
    console.log('dataset change: ', dataset);
  }

  handleDataVariableChange(variable: string): void {
    console.log('variable change: ', variable);
  }
}
