import altair as alt
import argparse
import numpy as np
import pandas as pd
import sqlite3
import typing as t

# List of substance for which the heatmaps should be generated. Each substance will have one row in the visualization.
substances = [
    'ALL_SUBSTANCES',
    'FENTANYL',
    'COCAINE',
    'MORPHINE',
    'CODEINE',
    'NORFENTANYL',
    'FENTANYL_ACETYL',
    'FENTANYL_4ANPP',
    'FURANYL_FENANTYL',
    'FIBF_FENTANYL',
    'CARFENTANYL',
    'OXYCODONE',
    'HYDROCODONE',
    'OXYMORPHONE',
    'HYDROMORPHONE',
    'DIHYDROCODEINE',
    'BENZOYLECGONINE',
    'METHADONE',
    'AMPHETAMINE',
    'METHAMPHETAMINE'
]

# The range of age groups. For example 5 means (0-4, 5-9...).
age_group_range = 5

# The label for the legend.
color_coding_label = "Avg Amt"

# Width of each heatmap within the visualization.
column_width = 170

# Height of each heatmap within the visualization.
column_height = 170

# Column names for the data that is extracted from db and assigned to the pandas data frame. 
columns = ['case_number', 'sex', 'substance_name', 'substance_amount', 'age_group', 'date_of_death', 'year']

# This function is used to format the date so that we can group by "month-year"
def _get_year_month(date: str):
    return date.split("-")[0]+"-"+date.split("-")[1] + "-" + "01"

# Returns true if it is the first column in the visulization.
def _is_first_column(sex: str):
    return sex == ""

# Generate heatmap for given substance and gender. 
def _get_heatmap(data_frame, substance = "", sex = "") -> alt.Chart:

    chart = alt.Chart(
        data_frame,
        # Heatmap title format eg: COCAINE - Male
        title=f"{sex}" if sex else f"{substance}",
        ).transform_calculate(
            # Transforming the group number to group range. eg: if group number is 2 it's group range should be (5-9)
            group=f'toString(5 * datum.age_group) + "-" + toString({age_group_range} * datum.age_group + {age_group_range - 1})'
        ).mark_rect().encode(
            alt.X('yearmonth(year_month_of_death):N', title=''),
            # Only displaying title and labels for the first column
            alt.Y('group:O', title='Age Group' if _is_first_column(sex) else '', axis=alt.Axis(labels=_is_first_column(sex))),
            color=f'{color_coding_label}:Q',
            tooltip= [alt.Tooltip(f'{color_coding_label}:O', format=".2f", formatType='number', title='Amount'), alt.Tooltip('group:O', title='Age Group')],
        ).properties(
            width= column_width,
            height = column_height
        )

    return chart

"""Genrate heatmaps for give substance name

Returns
-------
Altair Chart
    A single row of heatmaps with three heatmaps
"""
def _draw_heatmap_by_substance_name(df, substance_name: str) -> t.List[alt.Chart]:

    # From dataframe filtering data for given substance
    df_by_substance_name = df.query(f'substance_name == "{substance_name}"') if substance_name != 'ALL_SUBSTANCES' else df
    # Sharing the y axis with other columns in visualization
    heat_maps = alt.hconcat().resolve_scale(y='shared')

    # Grouping data by age group and month-year of death
    groups = df_by_substance_name.groupby(['age_group', 'year_month_of_death'])
    # Calculating mean of substance amount
    all_data = groups['substance_amount'].mean().reset_index(name=color_coding_label)
    heat_maps |=  _get_heatmap(all_data, substance_name)
  
    groups = df_by_substance_name.query('sex == "M"').groupby(['age_group', 'year_month_of_death'])
    male_data = groups['substance_amount'].mean().reset_index(name=color_coding_label)
    heat_maps |=  _get_heatmap(male_data, substance_name, "Male")

    groups = df_by_substance_name.query('sex == "F"').groupby(['age_group', 'year_month_of_death'])
    female_data = groups['substance_amount'].mean().reset_index(name=color_coding_label)
    heat_maps |= _get_heatmap(female_data, substance_name, "Female")
    
    return heat_maps

def _generate_heatmaps(data_frame, output: str) -> None:

    # Independent legend for each row.
    vis_rows = alt.vconcat().resolve_scale(color='independent', y='shared')

    # Getting heatmap row for each substance
    for substance in substances:
        vis_rows &= _draw_heatmap_by_substance_name(data_frame, substance)

    # Saving the visualization
    with open(f"{output}/site-data/visualization4/output.json", "w+") as f:
        f.write(vis_rows.to_json())

# Extract data from the database
def _get_data(database: sqlite3.Connection, output: str):
    
    df = pd.DataFrame(columns = columns)

    for substance in substances[1:]:
        query = f'''SELECT
                    CASE_NUMBER,
                    SEX,
                    '{substance}' AS SUBSTANCE_NAME,
                    {substance + "_AMOUNT"} AS SUBSTANCE_AMOUNT,
                    CAST((AGE / {age_group_range}) AS INT) AS AGE_GROUP,
                    DOD as DATE_OF_DEATH,
                    YEAR
                FROM deaths
                WHERE {substance + "_AMOUNT"} !=0'''

        data = database.execute(query).fetchall()
        current_df = pd.DataFrame(data, columns= columns)
        df = df.append(current_df)

    df['year_month_of_death'] = df['date_of_death'].apply(lambda x: _get_year_month(x)).astype('datetime64')
    df.to_csv(f'{output}/site-data/visualization4/visualization4.csv')
    
    return df[['sex', 'substance_name', 'substance_amount','age_group','year_month_of_death']]

def _create_command_line_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description='Create visualization 4 heatmaps')
    parser.add_argument('database', type=sqlite3.connect, help='path to database file')
    parser.add_argument('output', help='output path')
    return parser

if __name__ == '__main__':
    parser = _create_command_line_parser()
    namespace = parser.parse_args()
    output = namespace.output
    df = _get_data(namespace.database, output)
    _generate_heatmaps(df, output)