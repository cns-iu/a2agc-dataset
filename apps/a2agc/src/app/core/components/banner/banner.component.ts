import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';


/**
 * Page banner component
 */
@Component({
  selector: 'agc-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerComponent {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'agc-banner';
}
