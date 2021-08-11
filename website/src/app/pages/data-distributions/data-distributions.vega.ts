import { VisualizationSpec } from 'vega-embed';

export interface VariableData {
  dataset: string;
  name: string;
  variableName: string;
  type: string;
  description: string;
  missingValues: number;
  horizontal?: boolean;
  xLabel?: string;
  yLabel?: string;
}

export interface DistributionData {
  period: string;
  value?: string | number;
  count: number;
}

export function createPieSpec(variable: VariableData, distributionData: DistributionData[] = []): VisualizationSpec {
  let totalCount = 0;
  for (let i = 0; i < distributionData.length; i++) {
    totalCount += distributionData[i].count;
  };

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
        calculate: `format(datum.total*100/${totalCount}, ",.2f") + "%"`,
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
          dx: -520,
          dy: 50
        },
        mark: { type: 'arc', outerRadius: 130, strokeWidth: 2, stroke: 'white' },
        encoding: {
          theta: {
            field: 'total',
            type: 'quantitative',
            stack: true
          }
        }
      },
      {
        mark: { type: 'text', radius: 170, fill: 'black' },
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
        mark: { type: 'text', radius: 150, fontWeight: 'bold', fill: 'black' },
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
          yOffset: 100,
          xOffset: -560
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
          xOffset: -460
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
              stroke: "white",
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
              text: {field: 'totalFinal', type: 'nominal'}
            }
          }
        ]
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
    ]
  };
}
