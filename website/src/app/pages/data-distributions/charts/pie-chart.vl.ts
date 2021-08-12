import { VisualizationSpec } from 'vega-embed';
import { VariableData, DistributionData } from '../data-distributions.component';

export function createPieSpec(variable: VariableData, distributionData: DistributionData[] = []): VisualizationSpec {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    height: 300,
    data: {
      name: 'distribution'
    },
    view: {
      strokeOpacity: 0
    },
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
        calculate: '1',
        as: 'True'
      },
      {
        joinaggregate: [{
          op: 'sum',
          field: 'total',
          as: 'totalCount'
        }],
        groupby: ['True']
      },
      {
        calculate: 'format(datum.total*100/datum.totalCount, ",.2f") + "%"',
        as: 'percent'
      },
      {
        calculate: '"(" + datum.total + ")"',
        as: 'total2'
      }
    ],
    encoding: {
      color: {
        field: 'value',
        type: 'nominal',
        scale: { range: ['#77ACF0', '#2a4d87'] },
        legend: {
          orient: 'none',
          title: null,
          symbolType: 'square',
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
            { y: 1.7, label: 'Type:' },
            { y: 1.6, label: 'Description:' },
            { y: 1.5, label: 'Missing values:' }
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
            field: 'label'
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
            { y: 1.7, value: `${variable.type}` },
            { y: 1.6, value: `${variable.description}` },
            { y: 1.5, value: `${variable.missingValues.toFixed(1)}%` }
          ]
        },
        mark: {
          type: 'text',
          align: 'left',
          yOffset: 100,
          xOffset: -470
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
            value: 'black'
          }
        }
      }
    ],
    datasets: {
      distribution: distributionData
    }
  };
}
