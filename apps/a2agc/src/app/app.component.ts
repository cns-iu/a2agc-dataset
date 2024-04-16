import { AfterViewInit, Component, HostBinding, NgZone, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavContainer } from '@angular/material/sidenav';

import { buildInfo } from './build-info';
import { PageLink } from './core/models/pages.model';
import { DataState } from './core/state/data/data.state';
import { RouterState } from './core/state/router/router.state';
import { visualizations } from './core/state/visualizations/visualizations';
import { MarkdownModalComponent, MarkdownModalData } from './shared/components/markdown-modal/markdown-modal.component';

/**
 * A2AGC app component
 */
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'agc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'agc-root';

  /** Sidenav container component element */
  @ViewChild(MatSidenavContainer)
  readonly sidenavContainer!: MatSidenavContainer;

  /** Whether or not sidenav should include data distributions */
  showData = true;

  // TODO move these values to state
  /** Sidenav menu header */
  readonly menuHeader = 'Marion County Opioid Addiction Report';
  /** Page options to include in the sidenav menu */
  readonly pages: PageLink[] = visualizations.map((v) => ({
    path: v.id,
    title: v.title,
    description: v.description,
  }));

  /** Whether or not to show the subbar under the page header */
  subBarVisible = true;
  /** True if menu is open */
  menuOpen = false;
  /** Build date of app component */
  buildDate = buildInfo.buildDate;

  /**
   * Creates an instance of app component.
   * @param router Router state
   * @param datasetsState Datasets state
   * @param dialog Mat dialog service
   * @param zone NgZone
   */
  constructor(
    router: RouterState,
    dataState: DataState,
    private readonly dialog: MatDialog,
    private readonly zone: NgZone
  ) {
    router.navigationStart$.subscribe(() => {
      this.menuOpen = false;
    });

    dataState.isPrivate().subscribe((result) => {
      this.showData = result;
    });
  }

  /**
   * Sets sidenav after view init
   */
  ngAfterViewInit(): void {
    // NOTE: Scrollable is not available in ngOnInit even if @ViewChild has `static: true`
    this.sidenavContainer.scrollable.elementScrolled().subscribe(() => {
      // NOTE: This runs outside angular's zone
      // ALL modifications must be wrapped in calls to `this.zone.run` or related methods
      const offset =
        this.sidenavContainer.scrollable.measureScrollOffset('top');
      const visible = offset === 0;
      if (this.subBarVisible !== visible) {
        this.zone.run(() => {
          this.subBarVisible = visible;
        });
      }
    });
  }

  /**
   * Opens contact form
   */
  openContactUs(): void {
    this.dialog.open<MarkdownModalComponent, MarkdownModalData>(
      MarkdownModalComponent,
      {
        width: '800px',
        height: '600px',
        data: {
          title: 'Contact us',
          src: 'assets/footer/contact-us.md',
        },
      }
    );
  }

  /**
   * Opens privacy policy dialog
   */
  openPrivacyPolicy(): void {
    this.dialog.open<MarkdownModalComponent, MarkdownModalData>(
      MarkdownModalComponent,
      {
        width: '800px',
        height: '600px',
        data: {
          title: 'Privacy Policy',
          src: 'assets/footer/privacy-policy.md',
        },
      }
    );
  }
}
