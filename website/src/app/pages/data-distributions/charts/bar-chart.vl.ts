import { VisualizationSpec } from 'vega-embed';
import { VariableData, DistributionData } from '../data-distributions.component';

export function createBarSpec(variable: VariableData, distributionData: DistributionData[] = []): VisualizationSpec {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    datasets: {
      distribution: distributionData
    },
    height: 300,
    data: {
      name: 'distribution'
    },
    view: {
      strokeOpacity: 0
    },
    config: {
      concat: {
        spacing: 200,
        columns: 2
      }
    },
    hconcat: [
      {
        title: {
          text: `${variable.dataset} by ${variable.name}`,
        },
        view: {
          strokeOpacity: 0,
        },
        layer: [
          {
            data: {
              values: [
                /* eslint-disable @typescript-eslint/naming-convention */
                { y: 1.7, LABEL: 'Type:' },
                { y: 1.6, LABEL: 'Description:' },
                { y: 1.5, LABEL: 'Missing values:' }
                /* eslint-enable @typescript-eslint/naming-convention */
              ]
            },
            mark: {
              type: 'text',
              align: 'left',
              fontWeight: 'bold',
              xOffset: -50
            },
            encoding: {
              text: {
                type: 'nominal',
                field: 'LABEL'
              },
              y: {
                type: 'quantitative',
                field: 'y',
                axis: null
              },
              color: {
                value: '#212121'
              }
            }
          },
          {
            data: {
              values: [
                /* eslint-disable @typescript-eslint/naming-convention */
                { y: 1.7, VALUE: `${variable.type}` },
                { y: 1.6, VALUE: `${variable.description}` },
                { y: 1.5, VALUE: `${variable.missingValues.toFixed(1)}%` }
                /* eslint-enable @typescript-eslint/naming-convention */
              ]
            },
            mark: {
              type: 'text',
              align: 'left',
              xOffset: 40
            },
            encoding: {
              text: {
                type: 'nominal',
                field: 'VALUE'
              },
              y: {
                type: 'quantitative',
                field: 'y',
                axis: null
              },
              color: {
                value: '#212121'
              }
            }
          }
        ]
      },
      {
        view: {
          strokeOpacity: 0
        },
        width: 500,
        transform: [
          {
            calculate: 'slice(datum.period, 0, 4)',
            as: 'year'
          },
          {
            aggregate: [{
              op: 'sum',
              field: 'count',
              as: 'total'
            }],
            groupby: variable.horizontal ? ['value'] : ['year']
          },
          {
            calculate: 'format(datum.total, ",")',
            as: 'totalFinal'
          }
        ],
        encoding: !variable.horizontal ? {
          x: {
            field: 'year',
            type: 'nominal',
            axis: {
              titlePadding: 10,
              minExtent: 0,
              titleColor: '#212121',
              titleFontSize: 12,
              titleFontWeight: 'bold',
              tickColor: '#757575',
              domainColor: '#757575',
              labelFlush: false,
              grid: false,
              title: variable.xLabel,
              labelAngle: 0
            }
          },
          y: {
            field: 'total',
            type: 'quantitative',
            title: 'Count of Records',
            axis: {
              titlePadding: 10,
              titleColor: '#212121',
              titleFontSize: 12,
              titleFontWeight: 'bold',
              gridColor: '#e0e0e0',
              tickColor: '#757575',
              domainColor: '#757575',
              labelFontSize: 10,
              title: variable.yLabel
            }
          }
        } : {
          y: {
            field: 'value',
            type: 'nominal',
            axis: {
              titlePadding: 10,
              minExtent: 0,
              titleColor: '#212121',
              titleFontSize: 12,
              titleFontWeight: 'bold',
              tickColor: '#757575',
              domainColor: '#757575',
              labelFlush: false,
              grid: false,
              title: variable.yLabel
            }
          },
          x: {
            field: 'total',
            type: 'quantitative',
            title: 'Count of Records',
            axis: {
              titlePadding: 10,
              titleColor: '#212121',
              titleFontSize: 12,
              titleFontWeight: 'bold',
              gridColor: '#e0e0e0',
              tickColor: '#757575',
              domainColor: '#757575',
              labelFontSize: 10,
              title: variable.xLabel
            }
          }
        },
        layer: [
          {
            mark: {
              type: 'bar',
              width: 24,
              color: '#77ACF0',
              strokeWidth: 1,
              stroke: 'white',
              orient: `${variable.horizontal ? 'horizontal' : 'vertical'}`
            }
          },
          {
            mark: {
              type: 'text',
              align: variable.horizontal ? 'left' : 'center',
              baseline: 'middle',
              dx: variable.horizontal ? 3 : 0,
              dy: variable.horizontal ? 0 : -10
            },
            encoding: {
              text: { field: 'totalFinal', type: 'nominal' }
            }
          }
        ]
      }
    ]
  };
}