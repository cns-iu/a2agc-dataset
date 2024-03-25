import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';


/**
 * Header sub bar component
 */
@Component({
  selector: 'agc-sub-bar',
  template: '',
  styleUrls: ['./sub-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubBarComponent {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'agc-sub-bar';

  /** If sub bar is visible */
  @Input() @HostBinding('class.visible') visible = true;
}
