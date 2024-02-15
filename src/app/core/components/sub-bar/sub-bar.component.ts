import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';


@Component({
  selector: 'agc-sub-bar',
  template: '',
  styleUrls: ['./sub-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubBarComponent {
  @HostBinding('class') readonly clsName = 'agc-sub-bar';

  @Input() @HostBinding('class.visible') visible = true;
}
