## Usage

Click and drag within the line graph to select a specific time frame, filtering the data by time intervals. Use the mouse wheel to increase or decrease the length of the interval. You may also slide the selected interval left or right along the data axis.

## Purpose and Details

To provide insight on the frequency of common events (touch points) that occurred before an overdose death occurred, four touchpoints were analyzed. A comparison of the number of cases across each possible touchpoint combination, are reflected, including the cases in which no touchpoints apply. A total of 2,331 overdose deaths from 2010-2018 were referenced across four separate [datasets](/about) corresponding to each of the four touchpoints.

Analyzed touchpoints:

1. Opioid Prescription (Rx): Whether or not an individual had received an opioid prescription. This includes any opioid or benzo medications that were provided to the individual.
2. Overdose (OD): Whether or not an individual had a previous overdose requiring EMS intervention.
3. Incarceration (Jail): Whether or not an individual had been in jail.
4. Health Data (Health): Whether or not an individual had a recent encounter with healthcare services (excluding opioid prescriptions).

## Detailed Technical Information

Following rules were used to determined each of the following attributes:

1. Prescription VS No Prescription: True if any one of the flags OPIOID_FLAG or BENZO_FLAG was set in `medications` table for the particular CASE_NUMBER, False otherwise.
2. Overdose VS No Overdose: True if OVERDOSE_CC_MOI or NALOXONE_DUMMY was set in `ems_incidents` table for the particular CASE_NUMBER, False otherwise.
3. Justice Involvement VS No Involvement: If the particular CASE_NUMBER is present in `incarcerations` table then True, False otherwise.
4. Health Data VS No Health Data: True if CASE_NUMBER is present in `encounters` table, False otherwise.

The resulting aggregated data can be found [here](assets/generated/visualization5/data.csv).
