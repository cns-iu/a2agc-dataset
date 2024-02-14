# Age group and gender of accidental drug overdose deaths and population in Marion County 2010-2018
---------------------------------------------------------------------------------------------------

This example visualization shows a bar graph of opioid deaths broken down by gender and age group compared to the census data of Marion County, Indiana.

## Visualization

{{ vega.header() }}
{{ vega.include('./combined-spec.vl.json') }}

#### Legend

- Gray bars represent the percentage of opioid deaths in the corresponding age group.  
- Outlined bars represent the percentage of the population in the corresponding age group according to the census data.

## Data and Graphic Variable Extraction

Opioid death data was aggregated from the database using the following query:

{{ include_sql('src/visualization1/extract_data.sql') }}

The resulting aggregated data can be found [here](../data/vis1-data/death-counts.csv).
The original census data was retrieved from [here](https://factfinder.census.gov/bkmk/table/1.0/en/ACS/17_1YR/S0101/0500000US18097), and then processed using [this script](https://github.com/cns-iu/a2agc-dataset/blob/develop/src/visualization1/census_data.py) to produce a file with the same format as the aggregated opiod death data.  
The resulting file can be found [here](../data/vis1-data/census-counts.csv).
