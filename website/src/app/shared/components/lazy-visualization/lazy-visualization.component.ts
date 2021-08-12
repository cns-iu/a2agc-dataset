import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { View } from 'vega';
import { VisualizationSpec } from 'vega-embed';


@Component({
  selector: 'agc-lazy-visualization',
  templateUrl: './lazy-visualization.component.html',
  styleUrls: ['./lazy-visualization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyVisualizationComponent {
  @Input() spec!: VisualizationSpec;
  @Input() reactive = true;

  private vegaInstance?: View;
}
