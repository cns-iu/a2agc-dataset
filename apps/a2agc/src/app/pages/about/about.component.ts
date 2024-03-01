import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';


/**
 * About info page
 */
@Component({
  selector: 'agc-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'agc-about';
}
