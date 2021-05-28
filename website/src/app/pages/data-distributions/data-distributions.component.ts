import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';


@Component({
  selector: 'agc-data-distributions',
  templateUrl: './data-distributions.component.html',
  styleUrls: ['./data-distributions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataDistributionsComponent {
  @HostBinding('class') readonly clsName = 'data-schema-browser';
}
