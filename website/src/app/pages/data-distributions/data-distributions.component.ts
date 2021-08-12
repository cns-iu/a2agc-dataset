import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { DataDistributionsState } from 'src/app/core/state/data-distribution/data-distribution.state';


@Component({
  selector: 'agc-data-distributions',
  templateUrl: './data-distributions.component.html',
  styleUrls: ['./data-distributions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataDistributionsComponent {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'data-schema-browser';

  constructor(readonly data: DataDistributionsState) {}

  log<T>(data: T): T {
    console.log(data);
    return data;
  }
}
