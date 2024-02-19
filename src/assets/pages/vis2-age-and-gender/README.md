## Usage

Data can be filtered based on the following:

* Sex
* Year

The sex and year filters allow for multiple selections. Press **shift** for multiple selections. Click on an empty space in the visualization to clear selections.

## Purpose and Details

To provide information on the percentage of all opioid deaths according to age or gender groups, and allow filtering by year.

Blue/red bars represent the percentage of opioid deaths in the corresponding age group.  
Outlined bars represent the percentage of the population in the corresponding age group according to the census data.

## Detailed Technical Information

Opioid death data was aggregated from the database using the following query:

The resulting aggregated data can be found [here](assets/generated/vis2-data/death-counts.csv).
The original census data was retrieved from <a href="https://factfinder.census.gov/bkmk/table/1.0/en/ACS/17_1YR/S0101/0500000US18097" target="_blank">here</a>, and then processed using <a href="https://github.com/cns-iu/a2agc-dataset/tree/main/data-processor/src/visualization2/census_data.py" target="_blank">this script</a> to produce a file with the same format as the aggregated opioid death data.

The resulting file can be found [here](assets/generated/vis2-data/census-counts.csv).
