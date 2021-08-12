import { VisualizationSpec } from 'vega-embed';
import { VariableData, DistributionData } from '../data-distributions.component';

export function createPieSpec(variable: VariableData, distributionData: DistributionData[] = []): VisualizationSpec {
  let totalCount = 0;
  for (const entry of distributionData) {
    totalCount += entry.count;
  }

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
        calculate: 'datum.value === 1 ? "True" : "False"',
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
  };
}
