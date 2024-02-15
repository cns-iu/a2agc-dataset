import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';


@Component({
  selector: 'agc-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerComponent {
  @HostBinding('class') readonly clsName = 'agc-banner';
}
