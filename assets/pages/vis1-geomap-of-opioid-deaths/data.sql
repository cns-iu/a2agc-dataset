CREATE TEMPORARY TABLE "ALL_AGGREGATES" AS
SELECT -- Data Variables
  d.CASE_NUMBER,
  d.SEX,
  d.HOME_STATE,
  d.AGE,
  d.DOD,
  d.YEAR,
  d.ANY_HEROIN,
  d.ANY_COCAINE,
  d.FENTANYL,
  d.ANY_METHAMPHETAMINE,
  r.N_OPIOID_PRESCRIPTIONS,
  r.HYDROMORPHONE_1YEAR,
  r.MORPHINE_1YEAR,
  r.OXYMORPHONE_1YEAR,
  r.OXYCODONE_1YEAR,
  r.FENTANYL_1YEAR,
  r.ANTIANXIETY_1YEAR,
  r.ANTIDEPRESSANT_1YEAR,
  r.BENZODIAZEPINE_1YEAR,
  r.HYPNOTIC_1YEAR,
  r.OTHER_OPIOID_1YEAR,
  r.N_PRESCRIPTIONS,
  l.LATITUDE,
  l.LONGITUDE,
  -- Graphic Variables
  CASE
    WHEN d.ANY_HEROIN THEN 'Illicit'
    WHEN d.ANY_COCAINE THEN 'Illicit'
    WHEN d.FENTANYL THEN 'Illicit'
    WHEN d.ANY_METHAMPHETAMINE THEN 'Prescription'
    WHEN r.HYDROMORPHONE_1YEAR THEN 'Prescription'
    WHEN r.MORPHINE_1YEAR THEN 'Prescription'
    WHEN r.OXYMORPHONE_1YEAR THEN 'Prescription'
    WHEN r.OXYCODONE_1YEAR THEN 'Prescription'
    WHEN r.FENTANYL_1YEAR THEN 'Prescription'
    WHEN r.ANTIANXIETY_1YEAR THEN 'Prescription'
    WHEN r.ANTIDEPRESSANT_1YEAR THEN 'Prescription'
    WHEN r.BENZODIAZEPINE_1YEAR THEN 'Prescription'
    WHEN r.HYPNOTIC_1YEAR THEN 'Prescription'
    WHEN r.OTHER_OPIOID_1YEAR THEN 'Prescription'
    ELSE 'Neither'
  END AS 'ILLICIT_V_PRESCRIPTION',
  ---- Any Prescriptions?
  CASE
    WHEN r.N_PRESCRIPTIONS > 0 THEN 'True'
    ELSE 'False'
  END AS 'ANY_PRESCRIPTIONS',
  ---- Any Opioid Prescription in last year
  CASE
    WHEN r.HYDROMORPHONE_1YEAR THEN 'True'
    WHEN r.MORPHINE_1YEAR THEN 'True'
    WHEN r.OXYMORPHONE_1YEAR THEN 'True'
    WHEN r.OXYCODONE_1YEAR THEN 'True'
    WHEN r.FENTANYL_1YEAR THEN 'True'
    WHEN r.ANTIANXIETY_1YEAR THEN 'True'
    WHEN r.ANTIDEPRESSANT_1YEAR THEN 'True'
    WHEN r.BENZODIAZEPINE_1YEAR THEN 'True'
    WHEN r.HYPNOTIC_1YEAR THEN 'True'
    WHEN r.OTHER_OPIOID_1YEAR THEN 'True'
    ELSE 'False'
  END AS 'OPIOID_PRESCRIPTIONS_1YEAR',
  ---- Color coding by SEX
  CASE
    WHEN d.SEX = 'M' THEN 'Male'
    WHEN d.SEX = 'F' THEN 'Female'
    ELSE 'Neither'
  END AS 'SEX$$label',
  ---- Color coding by HOME_STATE
  CASE
    WHEN d.HOME_STATE = 'IN' THEN 'True'
    ELSE 'False'
  END AS 'HOME_STATE$$color',
  ---- Shape coding by HOME_STATE
  CASE
    WHEN d.HOME_STATE = 'IN' THEN 'circle'
    ELSE 'triangle'
  END AS 'HOME_STATE$$shape',
  ---- Size coding by N_OPIOID_PRESCRIPTIONS
  (
    CAST(r.N_OPIOID_PRESCRIPTIONS AS real) / (
      SELECT max(N_OPIOID_PRESCRIPTIONS)
      FROM rollup1
    ) * 500
  ) + 25 AS 'N_OPIOID_PRESCRIPTIONS$$areaSize',
  ---- For Color coding by AGE
  CASE
    WHEN d.AGE BETWEEN 0 AND 9 THEN '0 - 9'
    WHEN d.AGE BETWEEN 10 AND 19 THEN '10 - 19'
    WHEN d.AGE BETWEEN 20 AND 29 THEN '20 - 29'
    WHEN d.AGE BETWEEN 30 AND 39 THEN '30 - 39'
    WHEN d.AGE BETWEEN 40 AND 49 THEN '40 - 49'
    WHEN d.AGE BETWEEN 50 AND 59 THEN '50 - 59'
    WHEN d.AGE BETWEEN 60 AND 69 THEN '60 - 69'
    WHEN d.AGE > 70 THEN '70 >'
  END AS 'AGE_GROUP',
  ---- Fixed-value Graphic Variables
  'Fixed values for visualization' AS 'Fixed',
  '#bebebe' AS 'Fixed$$color',
  1 AS 'Fixed$$strokeWidth',
  0.4 AS 'Fixed$$strokeTransparency',
  0.2 AS 'Fixed$$transparency'
FROM deaths as d -- Join rollup1 for N_OPIOID_PRESCRIPTIONS
  INNER JOIN rollup1 as r ON d.CASE_NUMBER = r.CASE_NUMBER -- Join locations to get latitude/longitude of INJURY_ADDRESSes
  INNER JOIN locations as l ON d.INJURY_ADDRESS = l.ADDRESS
  and d.INJURY_CITY = l.CITY
  and d.INJURY_ZIP = l.ZIP
WHERE l.LATITUDE BETWEEN 37.77191769456694 AND 41.7605318
  AND l.LONGITUDE BETWEEN -88.09054069310693 AND -84.79556880758807
ORDER BY d.CASE_NUMBER ASC;

SELECT A."CASE_NUMBER" AS "CASE_NUMBER",
  LATITUDE AS "LATITUDE",
  LONGITUDE AS "LONGITUDE",
  -- SUBSTR(DOD, 0, 8) || '-01'  AS "PERIOD", -- Monthly periodicity
  strftime('%Y', DOD) || CASE
    WHEN cast(strftime('%m', DOD) as integer) BETWEEN 1 AND 3 THEN '-01-01'
    WHEN cast(strftime('%m', DOD) as integer) BETWEEN 4 and 6 THEN '-04-01'
    WHEN cast(strftime('%m', DOD) as integer) BETWEEN 7 and 9 THEN '-07-01'
    ELSE '-10-01'
  END AS "PERIOD",
  -- Quarterly Period
  "HOME_STATE$$shape",
  "N_OPIOID_PRESCRIPTIONS",
  "DATA_VARIABLE",
  "VALUE",
  A.SEX AS "SEX",
  A.OPIOID_PRESCRIPTIONS_1YEAR as "OPIOID_PRESCRIPTIONS_1YEAR",
  A.ILLICIT_V_PRESCRIPTION as "ILLICIT_V_PRESCRIPTION",
  A.YEAR as "YEAR"
FROM "ALL_AGGREGATES" A
  INNER JOIN (
    SELECT CASE_NUMBER,
      'SEX' AS "DATA_VARIABLE",
      "SEX$$label" AS "VALUE",
      SEX AS "SEX",
      YEAR AS "YEAR",
      OPIOID_PRESCRIPTIONS_1YEAR as "OPIOID_PRESCRIPTIONS_1YEAR",
      ILLICIT_V_PRESCRIPTION as "ILLICIT_V_PRESCRIPTION"
    FROM "ALL_AGGREGATES"
    UNION ALL
    SELECT CASE_NUMBER,
      'AGE' AS "DATA_VARIABLE",
      AGE_GROUP AS "VALUE",
      SEX AS "SEX",
      YEAR AS "YEAR",
      OPIOID_PRESCRIPTIONS_1YEAR as "OPIOID_PRESCRIPTIONS_1YEAR",
      ILLICIT_V_PRESCRIPTION as "ILLICIT_V_PRESCRIPTION"
    FROM "ALL_AGGREGATES"
    UNION ALL
    SELECT CASE_NUMBER,
      'ANY_PRESCRIPTIONS' AS "DATA_VARIABLE",
      ANY_PRESCRIPTIONS AS "VALUE",
      SEX AS "SEX",
      YEAR AS "YEAR",
      OPIOID_PRESCRIPTIONS_1YEAR as "OPIOID_PRESCRIPTIONS_1YEAR",
      ILLICIT_V_PRESCRIPTION as "ILLICIT_V_PRESCRIPTION"
    FROM "ALL_AGGREGATES"
    UNION ALL
    SELECT CASE_NUMBER,
      'OPIOID_PRESCRIPTIONS_1YEAR' AS "DATA_VARIABLE",
      OPIOID_PRESCRIPTIONS_1YEAR AS "VALUE",
      SEX AS "SEX",
      YEAR AS "YEAR",
      OPIOID_PRESCRIPTIONS_1YEAR as "OPIOID_PRESCRIPTIONS_1YEAR",
      ILLICIT_V_PRESCRIPTION as "ILLICIT_V_PRESCRIPTION"
    FROM "ALL_AGGREGATES"
    UNION ALL
    SELECT CASE_NUMBER,
      'ILLICIT_V_PRESCRIPTION' AS "DATA_VARIABLE",
      ILLICIT_V_PRESCRIPTION AS "VALUE",
      SEX AS "SEX",
      YEAR AS "YEAR",
      OPIOID_PRESCRIPTIONS_1YEAR as "OPIOID_PRESCRIPTIONS_1YEAR",
      ILLICIT_V_PRESCRIPTION as "ILLICIT_V_PRESCRIPTION"
    FROM "ALL_AGGREGATES"
  ) AS B ON (A.CASE_NUMBER = B.CASE_NUMBER);
