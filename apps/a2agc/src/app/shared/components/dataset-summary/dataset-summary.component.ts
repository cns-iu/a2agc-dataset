import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { DatasetMetaEntry } from '../../../core/models/dataset.model';


/**
 * Summary of dataset info
 */
@Component({
  selector: 'agc-dataset-summary',
  templateUrl: './dataset-summary.component.html',
  styleUrls: ['./dataset-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatasetSummaryComponent {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'dataset-summary';

  /** Dataset summary entries */
  @Input() summary: DatasetMetaEntry[] | null | undefined = [];
  /** Name of dataset variable */
  @Input() title: string | null = '';
}
