import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';


@Component({
  selector: 'agc-data-er-diagram',
  templateUrl: './data-er-diagram.component.html',
  styleUrls: ['./data-er-diagram.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataErDiagramComponent {
  @HostBinding('class') readonly clsName = 'data-er-diagram';
}
