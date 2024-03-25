import { VisualizationSpec } from 'vega-embed';

import { DatasetVariable } from '../../core/models/dataset.model';
import { DistributionDataEntry } from '../../core/models/distribution.model';


type LayerSpec = Extract<VisualizationSpec, { layer: unknown[] }>;
type AxisEncoding = NonNullable<NonNullable<LayerSpec['encoding']>['x']>;

/**
 * Additional bar chart label and axis settings
 */
export interface BarChartExtraOptions {
  /** X axis label */
  xLabel?: string;
  /** Y axis label */
  yLabel?: string;
  /** If axes are flipped */
  flipAxes?: boolean;
}


/**
 * Creates horizontal bar chart vega spec
 */
export function createHorizBarSpec(
  variable: DatasetVariable,
  distributionData: DistributionDataEntry[] = [],
  options: BarChartExtraOptions = {}
): VisualizationSpec {
  return createBarSpec(variable, distributionData, { ...options, flipAxes: true });
}

/**
 * Creates bar chart spec
 */
export function createBarSpec(
  _variable: DatasetVariable,
  distributionData: DistributionDataEntry[] = [],
  options: BarChartExtraOptions = {}
): VisualizationSpec {
  const { flipAxes, xLabel, yLabel } = options;

  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',

    autosize: {
      resize: true
    },
    width: 'container',

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
            as: 'total'
          }
        ],
        groupby: ['value']
      },
      {
        calculate: 'isDate(datum.value) ? timeFormat(datum.value, "%Y") : toString(datum.value)',
        as: 'label'
      },
      {
        calculate: 'format(datum.total, ",")',
        as: 'totalLabel'
      }
    ],

    encoding: {
      x: !flipAxes ? getXEncoding(xLabel, 0) : getYEncoding(xLabel),
      y: !flipAxes ? getYEncoding(yLabel) : getXEncoding(yLabel)
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
          text: {
            field: 'totalLabel',
            type: 'nominal'
          }
        }
      }
    ]
  };
}

/**
 * Returns x axis encoding object
 */
function getXEncoding(label?: string, labelAngle?: number): AxisEncoding {
  return {
    field: 'label',
    type: 'nominal',
    axis: {
      minExtent: 0,

      title: label,
      titlePadding: 10,
      titleColor: '#212121',
      titleFontSize: 12,
      titleFontWeight: 'bold',

      labelFlush: false,
      labelAngle,

      domainColor: '#757575',

      grid: false,
      tickColor: '#757575'
    }
  };
}

/**
 * Returns y axis encoding object
 */
function getYEncoding(label?: string): AxisEncoding {
  return {
    field: 'total',
    type: 'quantitative',
    title: 'Count of Records',
    axis: {
      title: label,
      titlePadding: 10,
      titleColor: '#212121',
      titleFontSize: 12,
      titleFontWeight: 'bold',

      labelFontSize: 10,

      domainColor: '#757575',

      gridColor: '#e0e0e0',
      tickColor: '#757575'
    }
  };
}
