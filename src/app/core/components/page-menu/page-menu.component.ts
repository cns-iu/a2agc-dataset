import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { PageLink } from '../../models/pages.model';


@Component({
  selector: 'agc-page-menu',
  templateUrl: './page-menu.component.html',
  styleUrls: ['./page-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageMenuComponent {
  @HostBinding('class') readonly clsName = 'agc-page-menu';

  @Input() header = '';
  @Input() pages: PageLink[] = [];

  linkId(_index: number, link: PageLink): string {
    return link.path;
  }
}
