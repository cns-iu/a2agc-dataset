import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Options, Spec } from 'ngx-vega';

import { PageState } from '../../../core/state/page/page.state';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { HelpTourModalComponent } from '../help-tour-modal/help-tour-modal.component';


/**
 * Visualization page component
 */
@Component({
  selector: 'agc-visualization-page',
  templateUrl: './visualization-page.component.html',
  styleUrls: ['./visualization-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisualizationPageComponent implements OnInit {
  /** HTML class name */
  @HostBinding('class') readonly clsName = 'agc-visualization-page';

  /** Page headline */
  @Input() headline = 'Marion County Opioid Addiction Report';
  /** Visualization title */
  @Input() title?: string;
  /** Visualization description */
  @Input() description?: string;
  /** Vega-lite spec */
  @Input() spec?: Spec;
  /** Visualization options */
  @Input() options: Options = { renderer: 'canvas', actions: true, width: 1268 };
  /** Expansion panel content markdown src */
  @Input() content?: string;
  /** Expansion panel SQL src */
  @Input() sql?: string;
  /** Expansion panel CSV src */
  @Input() csv?: string;

  /** True if spinners for expansion panel content are shown */
  spinners = {
    sql: true,
    csv: true,
    spec: true
  };
  /** True if the visualization is being loaded */
  loadingVegaVisualization = true;

  /**
   * Gets visualization spec as string
   */
  get specString(): string | undefined {
    return this.spec as string;
  }

  /**
   * Creates an instance of visualization page component.
   * @param dialog mat dialog service
   * @param page page state
   */
  constructor(
    private readonly dialog: MatDialog,
    readonly page: PageState
  ) { }

  /**
   * On load, opens help tour modal if hasn't been shown yet
   */
  ngOnInit(): void {
    if (!this.page.snapshot.hasShownHelpModal) {
      this.dialog.open(HelpTourModalComponent, {
        width: '50rem',
        data: {}
      });
      this.page.setHasShownHelpModal(true);
    }
  }

  /**
   * Disables spinner for expansion panel content
   * @param key sql, csv, or spec
   */
  disableSpinner(key: string): void {
    this.spinners = {
      ...this.spinners,
      [key]: false
    };
  }

  /**
   * Enables spinner for expansion panel content
   * @param key sql, csv, or spec
   */
  enableSpinner(key: string): void {
    this.spinners = {
      ...this.spinners,
      [key]: true
    };
  }

  /**
   * Opens help dialog
   */
  launchHelpDialog(): void {
    this.dialog.open(HelpModalComponent, {
      width: '60rem',
      data: {}
    });
  }
}
