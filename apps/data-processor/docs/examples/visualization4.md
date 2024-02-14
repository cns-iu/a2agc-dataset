# Accidental drug overdose death in Marion County by substance, sex and age group 2010-2018
--------------------------------------------

This visualization shows heatmaps of opioid deaths categorized by gender, age group, substance and year.

{{vega.header()}}
{{include_vega_ext('visualization4.vl.json')}}

([Source Vega-Lite Visualization Spec](./visualization4.vl.json))
## Data and Graphic Variable Extraction

Opiod death data was fetched from the database using the following query

The given query gets data for the following substances:

    1. Heroin
    2. Cocaine
    3. Fentanyl
    4. Prescription Opioid
    5. Any Opioid
    6. Benzodiazepine
    7. Methamphetamine


{{ include_sql('src/visualization4/data.sql') }}

The extracted data can be found [here](../data/visualization4/data.csv)