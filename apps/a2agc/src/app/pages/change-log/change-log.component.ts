import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';


/**
 * Changelog page
 */
@Component({
  selector: 'agc-change-log',
  templateUrl: './change-log.component.html',
  styleUrls: ['./change-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeLogComponent {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'change-log';
}
