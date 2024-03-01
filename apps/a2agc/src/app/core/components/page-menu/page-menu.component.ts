import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { PageLink } from '../../models/pages.model';


/**
 * Page menu component
 */
@Component({
  selector: 'agc-page-menu',
  templateUrl: './page-menu.component.html',
  styleUrls: ['./page-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageMenuComponent {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'agc-page-menu';

  /** Header text */
  @Input() header = '';
  /** Page menu link info */
  @Input() pages: PageLink[] = [];
  /** Whether to show the data distributions option */
  @Input() showData = true;

  /**
   * Gets path from PageLink item
   * @param _index page index
   * @param link page link item
   * @returns path name
   */
  linkId(_index: number, link: PageLink): string {
    return link.path;
  }
}
