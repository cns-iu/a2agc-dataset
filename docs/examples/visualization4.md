This example visualization shows heatmap of opioid deaths categorized by sex, age group, substance and date

# Data and Graphic Variable Extraction

Opiod death data was fetch from the database using the following query

Here `substance` is name of the substance for which we need details. Example: `Cocaine`
```sql
SELECT
	CASE_NUMBER,
    SEX,
    '{substance}' AS SUBSTANCE_NAME,
    {substance + "_AMOUNT"} AS SUBSTANCE_AMOUNT,
    CAST((AGE / {age_group_range}) AS INT) AS AGE_GROUP,
    DOD as DATE_OF_DEATH,
    YEAR
FROM deaths \
WHERE {substance + "_AMOUNT"} !=0'
```

The extracted data can be found [here](../data/visualization4/visualization4.csv)

# Data transformations

For each substance the data was transformed using `pandas` dataframes as following

```py
df['year_month_of_death'] = df['date_of_death'].apply(lambda x: _get_year_month(x)).astype('datetime64')

df['substance_name'] = df['substance_name'].apply(lambda x: x[1:])

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
```

Individual heatmaps were created using the following script and then stacked
 1. Horizontally based on ALL_GENDERS, Male, Female
 2. Vertically based on the `substance_name`

```py
    chart = alt.Chart(
        data_frame,
        # Heatmap title format eg: COCAINE - Male
        title=f"{substance} - {sex}" if sex else f"{substance}",
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
```

# Visualization

The final visualization is shown below.

{{vega_script_tags}}
{{include_vega_ext('../data/visualization4/output.json')}}
