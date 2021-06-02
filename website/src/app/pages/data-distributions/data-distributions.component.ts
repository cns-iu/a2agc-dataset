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
      sublabel: 'Make',
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
      sublabel: 'Breed',
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
