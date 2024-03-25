import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';


/**
 * Data entity-relationship diagram page
 */
@Component({
  selector: 'agc-data-er-diagram',
  templateUrl: './data-er-diagram.component.html',
  styleUrls: ['./data-er-diagram.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataErDiagramComponent {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'data-er-diagram';
}
