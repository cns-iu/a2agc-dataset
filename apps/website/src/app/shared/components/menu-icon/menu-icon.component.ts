import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';


@Component({
  selector: 'agc-menu-icon',
  templateUrl: './menu-icon.component.html',
  styleUrls: ['./menu-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuIconComponent {
  @HostBinding('class') readonly clsName = 'agc-menu-icon';

  @Input() alternateIcon = false;
}
