import { Options } from 'ngx-vega';
import { Spec } from 'vega';

import { createGeoZoomPatch } from '../../../shared/components/visualization-page/shared/geomap-zoom-patch';


export interface Visualization {
  title: string;
  description: string;
  spec: string;
  options: Options;
  content: string;
  sql: string;
  csv: string;
  id: string;
}

export const visualizations: Visualization[] = [
  {
    id: 'vis1-geomap-of-opioid-deaths',
    title: 'Accidental Drug Overdose Deaths',
    description: 'Marion County by Place of Injury (2010-2018)',
    spec: 'assets/pages/vis1-geomap-of-opioid-deaths/vis.vl.json',
    options: {
      renderer: 'svg', actions: true,
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
      }
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
    description: 'Marion County Encounters Over Time (2010 - 2018)',
    spec: 'assets/pages/vis6-maps-of-health/vis.vl.json',
    options: { renderer: 'svg', actions: true },
    content: 'assets/pages/vis6-maps-of-health/README.md',
    sql: 'assets/pages/vis6-maps-of-health/data-aggregate.sql',
    csv: 'assets/generated/visualization6/data-aggregate.csv'
  },
  {
    id: 'vis6-maps-of-health-v2',
    title: 'Maps of Health #2',
    description: 'Marion County Encounters Over Time (2010 - 2018)',
    spec: 'assets/pages/vis6-maps-of-health/vis2.vl.json',
    options: { renderer: 'svg', actions: true },
    content: 'assets/pages/vis6-maps-of-health/README.md',
    sql: 'assets/pages/vis6-maps-of-health/data-aggregate.sql',
    csv: 'assets/generated/visualization6/data-aggregate.csv'
  }
];
