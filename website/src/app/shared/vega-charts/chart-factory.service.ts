import { Injectable } from '@angular/core';
import { VisualizationSpec } from 'vega-embed';

import { CHART_CONFIG, ChartType } from '../../../configs/config';
import { DatasetVariable } from '../../core/models/dataset.model';
import { DistributionType } from '../../core/models/distribution.model';
import { createBarSpec } from './bar-chart.vl';
import { createPieSpec } from './pie-chart.vl';
import { createTimeSpec } from './time-slider.vl';


@Injectable({
  providedIn: 'root'
})
export class ChartFactoryService {
  readonly createBarChart = createBarSpec;
  readonly createPieChart = createPieSpec;
  readonly createTimeSlider = createTimeSpec;

  createChart(variable: DatasetVariable): VisualizationSpec | undefined {
    const { type: vtype, distribution: { type, summary: { distinct } } } = variable;
    const knownType = Object.values<string>(DistributionType).includes(type);

    if (!knownType || type === DistributionType.summary) {
      return undefined;
    }

    // FIXME: Reenable when pie chart supports more than 2 values
    // if (distinct <= CHART_CONFIG[ChartType.pie].maxDistinctValues) {
    //   return createPieSpec(variable);
    // }

    switch (type) {
      case DistributionType.pie:
        // FIXME: Pie chart only supports boolean data.
        // Needs to be able to support any data type with more than 2 distinct values
        if (distinct <= 2 && vtype === 'BOOLEAN') {
          return createPieSpec(variable);
        }

        /* fallthrough */
      case DistributionType.histogram:
        /* fallthrough */
      case DistributionType.verticalBar:
        if (distinct <= CHART_CONFIG[ChartType.verticalBar].maxDistinctValues) {
          return this.createBarChart(variable, [], {
            xLabel: variable.name,
            yLabel: 'Count of Records'
          });
        }
        /* fallthrough */

      case DistributionType.horizontalBar:
        if (distinct <= CHART_CONFIG[ChartType.horizontalBar].maxDistinctValues || vtype === 'DATE') {
          return this.createBarChart(variable, [], {
            flipAxes: true,
            xLabel: '# Total Deaths',
            yLabel: variable.name
          });
        }
        /* fallthrough */

      default:
        return undefined;
    }
  }
}
