import { VisualizationSpec } from 'vega-embed';

export interface VariableData {
  dataset: string;
  name: string;
  variableName: string;
  type: string;
  description: string;
  missingValues: number;
}

export interface DistributionData {
  period: string;
  value?: string | number;
  count: number;
}

export function createPieSpec(variable: VariableData, distributionData: DistributionData[] = []): VisualizationSpec {
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
    transform: [
      {
        calculate: "datum.value === 1 ? 'True' : 'False'",
        as: 'category'
      },
      {
        aggregate: [{
          op: 'sum',
          field: 'count',
          as: 'total'
        }],
        groupby: ['category']
      },
      {
        calculate: 'format(datum.total*100/2332, ",.2f") + "%"',
        as: 'percent'
      },
      {
        calculate: '"(" + datum.total + ")"',
        as: 'total2'
      }
    ],
    encoding: {
      color: {
        field: 'category',
        type: 'nominal',
        scale: { range: ['#77ACF0', '#2a4d87'] },
        legend: {
          orient: 'none',
          title: null,
          symbolType: 'square',
          values: ['True', 'False'],
          legendX: 20,
          legendY: 60,
          labelFontWeight: 'bold'
        }
      }
    },
    layer: [
      {
        title: {
          text: `${variable.dataset} by ${variable.name}`,
          dx: -370,
          dy: 50
        },
        mark: { type: 'arc', outerRadius: 100, strokeWidth: 2, stroke: 'white' },
        encoding: {
          theta: {
            field: 'total',
            type: 'quantitative',
            stack: true
          }
        }
      },
      {
        mark: { type: 'text', radius: 140, fill: 'black' },
        encoding: {
          text: { field: 'total2', type: 'nominal' },
          theta: {
            field: 'total',
            type: 'quantitative',
            stack: true
          }
        }
      },
      {
        mark: { type: 'text', radius: 120, fontWeight: 'bold', fill: 'black' },
        encoding: {
          text: { field: 'percent', type: 'nominal' },
          theta: {
            field: 'total',
            type: 'quantitative',
            stack: true
          }
        }
      },
      {
        data: {
          values: [
            /* eslint-disable @typescript-eslint/naming-convention */
            { y: 1.7, LABEL: 'Type' },
            { y: 1.6, LABEL: 'Description' },
            { y: 1.5, LABEL: 'Missing values' }
            /* eslint-enable @typescript-eslint/naming-convention */
          ]
        },
        mark: {
          type: 'text',
          align: 'left',
          fontWeight: 'bold',
          yOffset: 100,
          xOffset: -410
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
            value: 'black'
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
          yOffset: 100,
          xOffset: -320
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
            value: 'black'
          }
        }
      }
    ]
  }
}

export function createTimeSpec(distributionData: DistributionData[] = []): VisualizationSpec {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    datasets: {
      distribution: distributionData
    },
    height: 150,
    data: {
      name: 'distribution'
    },
    view: {
      strokeOpacity: 0
    },
    title: {
      text: 'Select Date Range to Update Datasets',
      dy: -20,
      dx: -320
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
    ]
  };
}
