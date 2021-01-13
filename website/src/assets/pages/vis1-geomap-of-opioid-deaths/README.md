## Visualization Creation

A MaV [project.yml](../data/vis-geomap-opioid-deaths.yml) file was created from the [csv file](assets/generated/vis-geomap-opioid-deaths.csv) using <a href="https://github.com/cns-iu/a2agc-dataset/blob/develop/src/create-vis-geomap-opioid-deaths-project.ts" target="_blank">this script</a>. The script creates a `Project` from the imported CSV file and sets up a geomap visualization (see below). This process was automated, but it can also be generated manually with <a href="https://cns-iu.github.io/make-a-vis/" target="_blank">Make-a-Vis</a> by loading the generated [csv file](assets/generated/vis-geomap-opioid-deaths.csv) and creating a visualization via the GUI.

You can download the [project.yml](../data/vis-geomap-opioid-deaths.yml) and load it into <a href="https://cns-iu.github.io/make-a-vis/" target="_blank">Make-a-Vis</a> to explore the visualization and potentially derive new ones from there.

## Data and Graphic Variable Extraction

In addition to extracting raw data, the query also creates columns for data-variable to graphic-variable mappings as follows:

* Color mapping was created from the `SEX` column, if `SEX` was `male`, a value of `blue` was assigned and for `female`, a value of `pink` was assigned.
* Stroke Color mapping was created from the `HOME_STATE` column, if `HOME_STATE` was `IN`, a value of `#bebebe` was assigned, else `black` was assigned.
* Shape mapping was created from `HOME_STATE`, if `HOME_STATE` was `IN`, a value of `circle` as assigned, else `triangle` was assigned.
* Area Size mapping was created from `N_OPIOID_PRESCRIPTIONS` and results interpolated in the range of `25 - 525`.

The results were exported to a [csv file](assets/generated/vis-geomap-opioid-deaths.csv) for loading into Make-a-Vis.