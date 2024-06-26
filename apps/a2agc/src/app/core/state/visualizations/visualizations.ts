import { Options } from 'ngx-vega';
import { Spec } from 'vega';

import { DataHandlerView } from '../../../shared/components/visualization-page/shared/data-handler-view';
import { createGeoZoomPatch } from '../../../shared/components/visualization-page/shared/geomap-zoom-patch';
import {
  Visualization6DataHandler,
} from '../../../shared/components/visualization-page/shared/visualization-6-data-handler';
import { VisualizationOneView } from './../../../shared/components/visualization-page/shared/visualization1-data-handler';


/**
 * Visualization info
 */
export interface Visualization {
  /** Visualization title */
  title: string;
  /** Visualization description */
  description: string;
  /** Path to Vega-lite spec */
  spec: string;
  /** Visualization options */
  options: Options;
  /** Path to readme content */
  content: string;
  /** Path to SQL */
  sql: string;
  /** Path to CSV */
  csv: string;
  /** Visualization id */
  id: string;
}

/** Visualization metadata */
export const visualizations: Visualization[] = [
  {
    id: 'vis1-geomap-of-opioid-deaths',
    title: 'Accidental Drug Overdose Deaths',
    description: 'Marion County by Place of Injury (2010-2018)',
    spec: 'assets/pages/vis1-geomap-of-opioid-deaths/vis.vl.json',
    options: {
      renderer: 'canvas', actions: true,
      patch: (spec: Spec): Spec => {
        spec = createGeoZoomPatch({
          center: [87.44305475, 38.76622477],
          zoomLevels: [3200, 250000],
          initialZoom: 6400,
        })(spec);

        // TODO: Determine width/height programmatically
        spec.width = 941;
        spec.height = 941;
        return spec;
      },
      viewClass: VisualizationOneView
    },
    content: 'assets/pages/vis1-geomap-of-opioid-deaths/README.md',
    sql: 'assets/pages/vis1-geomap-of-opioid-deaths/data.sql',
    csv: 'assets/generated/vis-geomap-opioid-deaths.csv'
  },
  {
    id: 'vis2-age-and-gender',
    title: 'Age Group & Gender of Accidental Drug Overdose',
    description: 'Marion County Deaths & Population (2010-2018)',
    spec: 'assets/pages/vis2-age-and-gender/vis.vl.json',
    options: {},
    content: 'assets/pages/vis2-age-and-gender/README.md',
    sql: 'assets/pages/vis2-age-and-gender/data.sql',
    csv: 'assets/generated/vis2-data/death-counts.csv'
  },
  {
    id: 'vis3-heatmap-of-accidental-overdoses',
    title: 'Age Group & Gender of Accidental Drug Overdose',
    description: 'Marion County by Deaths & Population (2010-2018)',
    spec: 'assets/pages/vis3-heatmap-of-accidental-overdoses/vis.vl.json',
    options: {},
    content: 'assets/pages/vis3-heatmap-of-accidental-overdoses/README.md',
    sql: 'assets/pages/vis4-combined-visualization/data.sql',
    csv: 'assets/generated/visualization4/data.csv'
  },
  {
    id: 'vis4-combined-visualization',
    title: 'Accidental Drug Overdose Deaths',
    description: 'Marion County by Substance, Sex, & Age (2010-2018)',
    spec: 'assets/pages/vis4-combined-visualization/vis.vl.json',
    options: {},
    content: 'assets/pages/vis4-combined-visualization/README.md',
    sql: 'assets/pages/vis4-combined-visualization/data.sql',
    csv: 'assets/generated/visualization4/data.csv'
  },
  {
    id: 'vis5-opioid-trajectories',
    title: 'Opioid Death Datasets',
    description: 'Marion County by History of Opioid Prescription, Previous Overdose, Incarceration, Health Data (2010-2018)',
    spec: 'assets/pages/vis5-opioid-trajectories/vis.vl.json',
    options: {},
    content: 'assets/pages/vis5-opioid-trajectories/README.md',
    sql: 'assets/pages/vis5-opioid-trajectories/data.sql',
    csv: 'assets/generated/visualization5/data.csv'
  },
  {
    id: 'vis6-maps-of-health',
    title: 'Maps of Health #1',
    description: 'Marion County Encounters Over Time (2004 - 2018)',
    spec: 'assets/pages/vis6-maps-of-health/vis.vl.json',
    options: {
      renderer: 'canvas',
      actions: true,
      width: 1268,
      viewClass: DataHandlerView.withDataHandlers([
        Visualization6DataHandler
      ])
    },
    content: 'assets/pages/vis6-maps-of-health/README.md',
    sql: 'assets/pages/vis6-maps-of-health/data.sql',
    csv: 'assets/generated/visualization6/data.csv'
  },
  {
    id: 'vis6-maps-of-health-v2',
    title: 'Maps of Health #2',
    description: 'Marion County Encounters Over Time (2004 - 2018)',
    spec: 'assets/pages/vis6-maps-of-health/vis2.vl.json',
    options: {
      renderer: 'canvas',
      actions: true,
      width: 1268,
      viewClass: DataHandlerView.withDataHandlers([
        Visualization6DataHandler
      ])
    },
    content: 'assets/pages/vis6-maps-of-health/README.md',
    sql: 'assets/pages/vis6-maps-of-health/data.sql',
    csv: 'assets/generated/visualization6/data.csv'
  },
  {
    id: 'vis6-maps-of-health-v3',
    title: 'Maps of Health #3',
    description: 'Marion County Encounters Over Time (2004 - 2018)',
    spec: 'assets/pages/vis6-maps-of-health/vis3.vl.json',
    options: {
      renderer: 'canvas',
      actions: true,
      width: 1268,
      viewClass: DataHandlerView.withDataHandlers([
        Visualization6DataHandler
      ])
    },
    content: 'assets/pages/vis6-maps-of-health/README.md',
    sql: 'assets/pages/vis6-maps-of-health/data.sql',
    csv: 'assets/generated/visualization6/data.csv'
  }
];
