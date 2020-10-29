## Legend

- Blue/red bars represent the percentage of opioid deaths in the corresponding age group.  
- Outlined bars represent the percentage of the population in the corresponding age group according to the census data.

## Data and Graphic Variable Extraction

Opioid death data was aggregated from the database using the following query:

The resulting aggregated data can be found [here](assets/generated/vis1-data/death-counts.csv).
The original census data was retrieved from [here](https://factfinder.census.gov/bkmk/table/1.0/en/ACS/17_1YR/S0101/0500000US18097), and then processed using [this script](https://github.com/cns-iu/a2agc-dataset/blob/develop/src/visualization1/census_data.py) to produce a file with the same format as the aggregated opioid death data.  
The resulting file can be found [here](assets/generated/vis1-data/census-counts.csv).
