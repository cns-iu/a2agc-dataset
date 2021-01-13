import { Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Options, Spec } from 'ngx-vega';
import { timeout } from 'rxjs/operators';
import { PageState } from 'src/app/core/state/page/page.state';
import { View } from 'vega';

import { HelpModalComponent } from '../help-modal/help-modal.component';
import { HelpTourModalComponent } from '../help-tour-modal/help-tour-modal.component';

@Component({
  selector: 'agc-visualization-page',
  templateUrl: './visualization-page.component.html',
  styleUrls: ['./visualization-page.component.scss']
})
export class VisualizationPageComponent implements OnInit {
  @HostBinding('class') readonly clsName = 'agc-visualization-page';

  @Input() headline = 'Marion County Opioid Addiction Report';
  @Input() title?: string;
  @Input() description?: string;
  @Input() spec?: Spec;
  @Input() options: Options = { renderer: 'canvas', actions: true, width: 1268 };
  @Input() content?: string;
  @Input() sql?: string;
  @Input() csv?: string;

  csvSpinnerActive = true;
  spinners = {
    sql: true,
    csv: true,
    spec: true
  };
  loadingVegaVisualization = true;

  ngOnInit(): void {
    if (!this.page.snapshot.hasShownHelpModal) {
      this.dialog.open(HelpTourModalComponent, {
        width: '50rem',
        data: {}
      });
      this.page.setHasShownHelpModal(true);
    }
  }

  disableSpinner(key: string): void {
    this.spinners = {
      ...this.spinners,
      [key]: false
    };
  }

  enableSpinner(key: string): void {
    this.spinners = {
      ...this.spinners,
      [key]: true
    };
  }

  get specString(): string | undefined {
    return this.spec as string;
  }

  constructor(
    private readonly dialog: MatDialog,
    readonly page: PageState
  ) { }

  async trackVegaLoading(view: View): Promise<void> {
    this.loadingVegaVisualization = true;
    await view.runAsync();
    this.loadingVegaVisualization = false;
 }

  launchHelpDialog(): void {
    this.dialog.open(HelpModalComponent, {
      width: '60rem',
      data: {}
    });
  }
}
