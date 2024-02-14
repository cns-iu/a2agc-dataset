import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';


@Component({
  selector: 'agc-data-schema-browser',
  templateUrl: './data-schema-browser.component.html',
  styleUrls: ['./data-schema-browser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataSchemaBrowserComponent {
  @HostBinding('class') readonly clsName = 'data-schema-browser';
}
