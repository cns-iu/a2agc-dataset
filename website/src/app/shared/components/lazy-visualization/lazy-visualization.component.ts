import { ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Autosize, Options } from 'ngx-vega';
import { View } from 'vega';
import { VisualizationSpec } from 'vega-embed';


@Component({
  selector: 'agc-lazy-visualization',
  templateUrl: './lazy-visualization.component.html',
  styleUrls: ['./lazy-visualization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyVisualizationComponent<T> implements OnChanges {
  @HostBinding('class') readonly clsName = 'agc-lazy-visualization';

  @Input() spec!: VisualizationSpec;
  @Input() dataBindingName!: string;
  @Input() data: T[] = [];
  @Input() autosize: Autosize = {};
  @Input() options?: Options;

  loading = true;

  private vegaInstance?: View;

  ngOnChanges(changes: SimpleChanges): void {
    if ('spec' in changes) {
      this.loading = true;
    } else if ('dataBindingName' in changes || 'data' in changes) {
      this.attachData();
    }
  }

  async setView(view: View): Promise<void> {
    this.vegaInstance = view;
    await this.attachData();
  }

  async attachData(): Promise<void> {
    this.vegaInstance?.data(this.dataBindingName, this.data);
    await this.vegaInstance?.runAsync();
  }
}
