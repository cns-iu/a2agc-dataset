# Changelog
-----------

Changelog for A2AGC

## 0.5.0 - 2021-08-16

### Added in 0.5.0

- Improved speed/responsiveness of geomap
- Fixed data filtering in visualization 5
- Added two Maps of Health visualizations (POC)
- Added an updated Data Distributions Page
- Updated dependencies to Angular 12
- Updated specs to vega-lite 5
- Remember if a user has seen the initial help display for the life of the browser cache (localStorage)
- Run automatic testing + build previews of code for development (CI/CD)

## 0.4.0 - 2020-11-02

### Added in 0.4.0

- A completely revamped website
- Updates to all 5 visualizations

## 0.3.0 - 2020-04-17

### Added in 0.3.0

- Addressed much of the [feedback](https://docs.google.com/document/d/1Ed2xnKydlTSF_61jsuKElFiynM3ZIb6UkQxHU8C5saA/edit#) given from the last sprint
- Refreshed theme, navigation, and UI
- Added more data source documentation
- Fixed spelling errors
- Revised geomap, now called "Accidental drug overdose deaths in Marion County by place of injury 2010-2018"
- Revised demographic comparisons, now called "Age group and gender of accidental drug overdose deaths and population in Marion County 2010-2018"
- Revised heamaps, now called "Accidental drug overdose death in Marion County by substance, sex and age group 2010-2018"
- Added an interactive version of above, called "Accidental drug overdose death in Marion County by substance, sex and age group 2010-2018 (interactive)"
- Revised death trajectories to add a visualization of the trajectories instead of a table

## 0.2.0 - 2019-11-27

### Added in 0.2.0

- Added three new visualizations:
    - Demographic Comparison of Opioid Deaths
    - Heatmaps of Deaths with Substance
    - Heatmaps of Substance Proportions at Death
- Fixed some misspellings
- Removed incomplete content
- Cleaned up navigation menu

## 0.1.0 - 2019-07-08

### Added in 0.1.0

- First release of the A2AGC dataset and website
- Created a documentation site populated with information about the data and visualization examples
- Created automated scripts to download the A2AGC data from Box, ingest into a federated, typed, and validated SQLite database.
- Created automated scripts to analyze the column level data and generate visualizations and analytics
- Created an initial example visualization (a geographic map of opioid deaths) with documentation
- We now have a full workflow going from raw data to relational database to analytics and visualizations to documentation website
