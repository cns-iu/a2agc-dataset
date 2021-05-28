import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';


@Component({
  selector: 'agc-change-log',
  templateUrl: './change-log.component.html',
  styleUrls: ['./change-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeLogComponent {
  @HostBinding('class') readonly clsName = 'change-log';
}
