import { VisualizationSpec } from 'vega-embed';

import { DatasetVariable } from '../../core/models/dataset.model';
import { DistributionDataEntry } from '../../core/models/distribution.model';


export function createPieSpec(
  _variable: DatasetVariable,
  distributionData: DistributionDataEntry[] = []
): VisualizationSpec {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',

    width: 'container',
    height: 350,
    autosize: {
      resize: true
    },

    view: {
      strokeOpacity: 0
    },

    data: {
      name: 'distribution',
      values: distributionData
    },

    transform: [
      {
        aggregate: [
          {
            op: 'sum',
            field: 'count',
            as: 'count'
          }
        ],
        groupby: ['value']
      },
      {
        joinaggregate: [
          {
            op: 'sum',
            field: 'count',
            as: 'total'
          }
        ]
      },
      {
        calculate: 'datum.count / datum.total',
        as: 'percentage'
      },

      {
        calculate: 'isDate(datum.value) ? timeFormat(datum.value, "%Y") : toString(datum.value)',
        as: 'label'
      },
      {
        calculate: '"(" + datum.count + ")"',
        as: 'countLabel'
      },
      {
        calculate: 'format(datum.percentage, ",.2%")',
        as: 'percentageLabel'
      }
    ],

    encoding: {
      color: {
        field: 'value',
        type: 'nominal',

        scale: {
          // FIXME: Verify what color scheme to use!
          scheme: 'tableau20'
        },

        legend: {
          title: null,
          orient: 'top-left',
          symbolType: 'square',
          labelExpr: 'datum.label',
          labelFontWeight: 'bold'
        }
      },

      theta: {
        field: 'count',
        type: 'quantitative',
        stack: true
      }
    },

    layer: [
      {
        mark: {
          type: 'arc',
          radius: 130,
          stroke: 'white',
          strokeWidth: 2
        }
      },

      {
        mark: {
          type: 'text',
          radius: 160,
          fill: 'black',
          fontWeight: 'bold'
        },

        encoding: {
          text: {
            field: 'percentageLabel',
            type: 'nominal'
          }
        }
      },

      {
        mark: {
          type: 'text',
          radius: 160,
          fill: 'black',
          yOffset: 15
        },

        encoding: {
          text: {
            field: 'countLabel',
            type: 'nominal'
          }
        }
      }
    ]
  };
}
