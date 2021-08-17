import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { DatasetMetaEntry } from '../../../core/models/dataset.model';


@Component({
  selector: 'agc-dataset-summary',
  templateUrl: './dataset-summary.component.html',
  styleUrls: ['./dataset-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatasetSummaryComponent {
  @HostBinding('class') readonly clsName = 'dataset-summary';

  @Input() summary: DatasetMetaEntry[] | null | undefined = [];
  @Input() title: string | null = '';
}
