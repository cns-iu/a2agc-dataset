import { VisualizationSpec } from 'vega-embed';

import { DistributionDataEntry } from '../../core/models/distribution.model';


export function createTimeSpec(distributionData: DistributionDataEntry[] = []): VisualizationSpec {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',

    width: 'container',
    height: 150,

    title: {
      text: 'Select Date Range to Update Datasets',
      align: 'left',
      anchor: 'start'
    },

    view: {
      strokeOpacity: 0
    },

    data: {
      name: 'distribution',
      values: distributionData
    },

    mark: 'line',

    params: [
      {
        name: 'period',
        select: {
          type: 'interval',
          encodings: ['x'],
          mark: {
            fill: '#6ea7ef',
            fillOpacity: 0.15
          }
        }
      }
    ],

    encoding: {
      color: {
        value: '#6ea7ef'
      },

      x: {
        field: 'period',
        type: 'temporal',
        title: 'Year',

        axis: {
          minExtent: 0,

          titlePadding: 10,
          titleFontSize: 14,

          tickColor: '#757575',
          domainColor: '#757575',

          labelExpr: '[month(datum.value) === 0 ? timeFormat(datum.value, "%Y") : ""]',
          labelFlush: false,

          gridDash: {
            condition: {
              test: {
                field: 'value',
                timeUnit: 'month',
                equal: 7
              },
              value: [2, 2]
            },
            value: []
          },
          gridColor: {
            condition: {
              test: {
                field: 'value',
                timeUnit: 'month',
                equal: 1
              },
              value: '#bdbdbd'
            },
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

          domainColor: '#757575',
          labelFontSize: {
            condition: {
              test: {
                field: 'index',
                equal: 1
              },
              value: 0
            },
            value: 10
          },

          gridColor: '#e0e0e0',
          gridOpacity: {
            condition: {
              test: {
                field: 'index',
                equal: 1
              },
              value: 0
            },
            value: 1
          },

          tickColor: '#757575',
          tickOpacity: {
            condition: {
              test: {
                field: 'index',
                equal: 1
              },
              value: 0
            },
            value: 1
          }
        }
      }
    }
  };
}
