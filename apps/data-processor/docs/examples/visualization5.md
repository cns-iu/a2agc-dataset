# Geographic Map of Opioid Deaths
---------------------------------

This example visualization shows a geographic map of opioid deaths that occurred from 2010-2018 in Marion County, Indiana.

## Visualization

{{ vega.header() }}
{{ js.include('./geo-zoom.js') }}
{{ vega.include('./visualization5.vl.json', { 'actions': True }) }}

## Visualization Creation

A VegaLite [specification](./visualization5.vl.json) was manually written to conform to the requirements. The resulting specifications are then displayed using [Vega-Embed](https://github.com/vega/vega-embed) with zooming and panning functionality added to the result using a javascript [patch](./geo-zoom.js).

## Data and Graphic Variable Extraction

Opioid death data was fetched from the database using the following query:

{{ embed_code('src/create-vis-geomap-opioid-deaths-data.sql') }}

In addition to extracting raw data, the query also creates columns for data-variable to graphic-variable mappings as follows:

* Color mapping was created from the `SEX` column, if `SEX` was `male`, a value of `blue` was assigned and for `female`, a value of `pink` was assigned.
* Stroke Color mapping was created from the `HOME_STATE` column, if `HOME_STATE` was `IN`, a value of `#bebebe` was assigned, else `black` was assigned.
* Shape mapping was created from `HOME_STATE`, if `HOME_STATE` was `IN`, a value of `circle` as assigned, else `triangle` was assigned.
* Area Size mapping was created from `N_OPIOID_PRESCRIPTIONS` and results interpolated in the range of `25 - 525`.

The results were exported to a [csv file](../data/vis-geomap-opioid-deaths.csv) for loading into Make-a-Vis.