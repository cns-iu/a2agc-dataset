import { VisualizationSpec } from 'vega-embed';

import { DistributionDataEntry } from '../../core/models/distribution.model';


export function createTimeSpec(distributionData: DistributionDataEntry[] = []): VisualizationSpec {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    height: 150,
    width: 'container',
    data: {
      name: 'distribution'
    },
    view: {
      strokeOpacity: 0
    },
    title: {
      text: 'Select Date Range to Update Datasets',
      dy: -20,
      dx: -360
    },
    layer: [
      {
        mark: {
          type: 'line'
        },
        params: [
          {
            name: 'period',
            select: {
              type: 'interval',
              encodings: ['x'],
              mark: { fill: '#6ea7ef', fillOpacity: 0.15 }
            }
          }
        ],
        encoding: {
          x: {
            field: 'period',
            type: 'temporal',
            title: 'Year',
            axis: {
              titlePadding: 10,
              minExtent: 0,
              titleFontSize: 14,
              tickColor: '#757575',
              domainColor: '#757575',
              labelFlush: false,
              labelExpr: '[timeFormat(datum.value, "%m") == "01" ? timeFormat(datum.value, "%Y") : ""]',
              gridDash: {
                condition: { test: { field: 'value', timeUnit: 'month', equal: 7 }, value: [2, 2] },
                value: []
              },
              gridColor: {
                condition: { test: { field: 'value', timeUnit: 'month', equal: 1 }, value: '#BDBDBD' },
                value: '#e0e0e0'
              }
            }
          },
          y: {
            aggregate: 'sum',
            field: 'count',
            type: 'quantitative',
            title: '# Deaths',
            axis: {
              titlePadding: 10,
              titleFontSize: 14,
              gridColor: '#e0e0e0',
              tickColor: '#757575',
              domainColor: '#757575',
              gridOpacity: {
                condition: { test: { field: 'index', equal: 1 }, value: 0 },
                value: 1
              },
              tickOpacity: {
                condition: { test: { field: 'index', equal: 1 }, value: 0 },
                value: 1
              },
              labelFontSize: {
                condition: { test: { field: 'index', equal: 1 }, value: 0 },
                value: 10
              }
            }
          },
          color: {
            value: '#6ea7ef'
          }
        }
      }
    ],
    datasets: {
      distribution: distributionData
    }
  };
}
