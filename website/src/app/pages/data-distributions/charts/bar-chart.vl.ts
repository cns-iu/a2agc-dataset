import { VisualizationSpec } from 'vega-embed';
import { VariableData, DistributionData } from '../data-distributions.component';

export function createHorizBarSpec(variable: VariableData, distributionData: DistributionData[] = []): VisualizationSpec {
  return createBarSpec(variable, distributionData, true);
}

export function createBarSpec(variable: VariableData, distributionData: DistributionData[] = [], flipAxes = false): VisualizationSpec {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
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
                { y: 1.7, label: 'Type:' },
                { y: 1.55, label: 'Description:' },
                { y: 1.4, label: 'Missing values:' }
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
                field: 'label'
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
                { y: 1.7, value: `${variable.type}` },
                { y: 1.55, value: `${variable.description}` },
                { y: 1.4, value: `${variable.missingValues.toFixed(1)}%` }
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
                field: 'value'
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
            aggregate: [{
              op: 'sum',
              field: 'count',
              as: 'total'
            }],
            groupby: ['value']
          },
          {
            calculate: 'format(datum.total, ",")',
            as: 'totalFinal'
          }
        ],
        encoding: !flipAxes ? {
          x: {
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
              orient: flipAxes ? 'horizontal' : 'vertical'
            }
          },
          {
            mark: {
              type: 'text',
              align: flipAxes ? 'left' : 'center',
              baseline: 'middle',
              dx: flipAxes ? 3 : 0,
              dy: flipAxes ? 0 : -10
            },
            encoding: {
              text: { field: 'totalFinal', type: 'nominal' }
            }
          }
        ]
      }
    ],
    datasets: {
      distribution: distributionData
    }
  };
}
