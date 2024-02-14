import altair as alt
import argparse
import numpy as np
import pandas as pd
import sqlite3
import typing as t

# List of substance for which the heatmaps should be generated. Each substance will have one row in the visualization.
substances = [
    'ALL_SUBSTANCES',
    'HEROIN',
    'COCAINE',
    'FENTANYL',
    'ILLICIT_OPIOID',
    'PRESCRIPTION_OPIOID',
    'OPIOID',
    'BENZODIAZEPINE',
    'METHAMPHETAMINE'
]

# The range of age groups. For example 5 means (0-4, 5-9...).
age_group_range = 5

# Width of each heatmap within the visualization.
column_width = 170

# Height of each heatmap within the visualization.
column_height = 170

# Column names for the data that is extracted from db and assigned to the pandas data frame. 
columns = ['case_number', 'sex', 'substance_name', 'age_group', 'date_of_death', 'year',]

# Returns true if it is the first column in the visulization.
def _is_first_column(sex: str):
    return sex == ""

# Generate heatmap for given substance and gender. 
def _get_heatmap(data_frame, substance = "", sex = "") -> alt.Chart:

    chart = alt.Chart(
        data_frame,
        # Heatmap title format eg: COCAINE - Male
        title=f"{sex}" if sex else f"{substance}",
        ).transform_aggregate(
            # Grouping by age_group and year, then taking count of the each group
            total_deaths='count():Q',
            groupby=["age_group", "year"]
        ).transform_calculate(
            # Transforming the group number to group range. eg: if group number is 2 it's group range should be (5-9)
            group=f'toString(5 * datum.age_group) + "-" + toString({age_group_range} * datum.age_group + {age_group_range - 1})'
        ).mark_rect().encode(
            alt.X('year:O', title=''),
            # Only displaying title and labels for the first column
            alt.Y('group:O', title='Age Group' if _is_first_column(sex) else '', axis=alt.Axis(labels=_is_first_column(sex))),

             # Color coding with the total count of deaths in each age_group and year
            color=alt.Color('total_deaths:Q', title='Deaths', scale=alt.Scale(scheme="yellowgreenblue")),
            tooltip= [
                alt.Tooltip('total_deaths:O', title='Deaths'),
                alt.Tooltip('group:O', title='Age Group'),
                alt.Tooltip('year:O', title='Year')
            ],
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
    
    # Horizontally concatenating the visualizations
    heat_maps |=  _get_heatmap(df_by_substance_name, substance_name)
  
    # For males
    male_data = df_by_substance_name.query('sex == "M"')
    heat_maps |=  _get_heatmap(male_data, substance_name, "Male")

    # For females
    female_data = df_by_substance_name.query('sex == "F"')
    heat_maps |= _get_heatmap(female_data, substance_name, "Female")
    
    return heat_maps

# 1. We filter the data for given substance and generate the heatmap
# 2. Similarly we get the chart by filtering data where gender is male
# 3. And then we generate the third heatmap for each row by filtering the data where gender is female
# 4. We concatenate horizontally all three heatmaps to make it a single row for the complete visualization
# 5. We do all 4 steps for each substance

def _generate_heatmaps(data_frame, output: str) -> None:

    # Independent legend for each row.
    vis_rows = alt.vconcat().resolve_scale(color='independent', y='shared')

    # Getting heatmap row for each substance
    for substance in substances:
        vis_rows &= _draw_heatmap_by_substance_name(data_frame, substance)

    # Saving the visualization
    with open(f"{output}/site-data/visualization4a/output.json", "w+") as f:
        f.write(vis_rows.to_json())

# Extract data from the database
def _get_data(database: sqlite3.Connection, output: str):
    
    df = pd.DataFrame(columns = columns)

    for substance in substances[1:]:
        query = f'''SELECT
                    CASE_NUMBER,
                    SEX,
                    '{substance}' AS SUBSTANCE_NAME,
                    CAST((AGE / {age_group_range}) AS INT) AS AGE_GROUP,
                    DOD as DATE_OF_DEATH,
                    YEAR
                FROM deaths
                WHERE {"ANY_" + substance} == 1'''

        data = database.execute(query).fetchall()
        current_df = pd.DataFrame(data, columns= columns)
        df = df.append(current_df)

    # Saving data to the csv file
    df.to_csv(f'{output}/site-data/visualization4a/visualization4a.csv')
    
    return df[['sex', 'substance_name','age_group', 'year']]

def _create_command_line_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description='Create visualization 4 heatmaps')
    parser.add_argument('database', type=sqlite3.connect, help='path to database file')
    parser.add_argument('output', help='output path')
    return parser

if __name__ == '__main__':
    alt.data_transformers.enable('default', max_rows=10000)
    parser = _create_command_line_parser()
    namespace = parser.parse_args()
    output = namespace.output
    df = _get_data(namespace.database, output)
    _generate_heatmaps(df, output)