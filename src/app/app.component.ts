import { AfterViewInit, Component, HostBinding, NgZone, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavContainer } from '@angular/material/sidenav';

import { buildInfo } from './build-info';
import { PageLink } from './core/models/pages.model';
import { RouterState } from './core/state/router/router.state';
import { visualizations } from './core/state/visualizations/visualizations';
import { MarkdownModalComponent, MarkdownModalData } from './shared/components/markdown-modal/markdown-modal.component';


// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'agc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @HostBinding('class') readonly clsName = 'agc-root';

  @ViewChild(MatSidenavContainer)
  readonly sidenavContainer!: MatSidenavContainer;

  // TODO move these values to state
  readonly menuHeader = 'Marion County Opioid Addiction Report';
  readonly pages: PageLink[] = visualizations.map(v => ({
    path: v.id, title: v.title, description: v.description
  }));

  subBarVisible = true;
  menuOpen = false;
  buildDate = buildInfo.buildDate;

  constructor(
    router: RouterState,
    private readonly dialog: MatDialog,
    private readonly zone: NgZone
  ) {
    router.navigationStart$.subscribe(() => {
      this.menuOpen = false;
    });
  }

  ngAfterViewInit(): void {
    // NOTE: Scrollable is not available in ngOnInit even if @ViewChild has `static: true`
    this.sidenavContainer.scrollable.elementScrolled().subscribe(() => {
      // NOTE: This runs outside angular's zone
      // ALL modifications must be wrapped in calls to `this.zone.run` or related methods
      const offset = this.sidenavContainer.scrollable.measureScrollOffset('top');
      const visible = offset === 0;
      if (this.subBarVisible !== visible) {
        this.zone.run(() => {
          this.subBarVisible = visible;
        });
      }
    });
  }

  openContactUs(): void {
    this.dialog.open<MarkdownModalComponent, MarkdownModalData>(MarkdownModalComponent, {
      width: '800px',
      height: '600px',
      data: {
        title: 'Contact us',
        src: 'assets/footer/contact-us.md'
      }
    });
  }

  openPrivacyPolicy(): void {
    this.dialog.open<MarkdownModalComponent, MarkdownModalData>(MarkdownModalComponent, {
      width: '800px',
      height: '600px',
      data: {
        title: 'Privacy Policy',
        src: 'assets/footer/privacy-policy.md'
      }
    });
  }
}
