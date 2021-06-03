import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'agc-sub-selector',
  templateUrl: './sub-selector.component.html',
  styleUrls: ['./sub-selector.component.scss']
})
export class SubSelectorComponent {
  @HostBinding('class') readonly clsName = 'agc-sub-selector';
}
