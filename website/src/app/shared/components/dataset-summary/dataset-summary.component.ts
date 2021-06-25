import { Component, HostBinding, ChangeDetectionStrategy, Input } from '@angular/core';
import { DatasetSummary } from 'src/app/core/models/dataset.model';

@Component({
  selector: 'agc-dataset-summary',
  templateUrl: './dataset-summary.component.html',
  styleUrls: ['./dataset-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatasetSummaryComponent {
  @HostBinding('class') readonly clsName = 'dataset-summary';

  @Input() summary: DatasetSummary[] | null | undefined = [];
  @Input() title: string | null = '';
}
