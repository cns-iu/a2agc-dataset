import { Injectable } from '@angular/core';
import { VisualizationSpec } from 'vega-embed';

import { DatasetVariable } from '../../core/models/dataset.model';
import { createBarSpec } from './bar-chart.vl';
import { createPieSpec } from './pie-chart.vl';
import { createTimeSpec } from './time-slider.vl';


const VERTICAL_BAR_CHART_THRESHOLD = 50;

@Injectable({
  providedIn: 'root'
})
export class ChartFactoryService {
  readonly createBarChart = createBarSpec;
  readonly createPieChart = createPieSpec;
  readonly createTimeSlider = createTimeSpec;

  createChart(variable: DatasetVariable): VisualizationSpec | undefined {
    const { distribution: dist } = variable;
    switch (dist.type) {
      case 'horizontal-bar-chart':
        /* fallthrough */
      case 'bar-chart':
        /* fallthrough */
      case 'histogram': {
        const horizontal = dist.type !== 'bar-chart' ||
          dist.summary.distinct > VERTICAL_BAR_CHART_THRESHOLD;
        const xLabel = horizontal ? '# Total Deaths' : variable.name;
        const yLabel = horizontal ? variable.name : 'Count of Records';
        return this.createBarChart(variable, [], {
          flipAxes: horizontal,
          xLabel, yLabel
        });
      }

      case 'pie-chart':
        return this.createPieChart(variable);

      default:
        return undefined;
    }
  }
}
