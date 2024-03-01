import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';


/**
 * Component for menu icon in header
 */
@Component({
  selector: 'agc-menu-icon',
  templateUrl: './menu-icon.component.html',
  styleUrls: ['./menu-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuIconComponent {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'agc-menu-icon';

  /** Use alternate icon */
  @Input() alternateIcon = false;
}
