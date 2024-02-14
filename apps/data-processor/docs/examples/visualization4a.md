# Accidental Drug Overdose Deaths

#### Marion County by Substance, Sex, & Age (2010-2018)
<br/>
<br/>

{{vega_script_tags}}
{{include_vega_ext('./visualization4a.vl.json')}}

([Source Vega-Lite Visualization Spec](./visualization4a.vl.json))

## Usage

Data can be filtered based on the following:
    
* Year Range: User can select year range using the line graph. Click and drag the mouse to select the year range.

* Substance Name and Sex: The heatmap with y-axis with substance names and x-axis with sex can be used to select the particular substance and sex. Press **shift** for multiple selections.

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