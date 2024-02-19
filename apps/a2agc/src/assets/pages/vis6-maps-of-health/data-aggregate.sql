WITH
  P AS (
    SELECT CASE_NUMBER, COUNT(DISTINCT(PHYS_TIME)) AS OPIOID_PRESCRIPTIONS
    FROM medications
    WHERE OPIOID_FLAG + BENZO_FLAG > 0
    GROUP BY CASE_NUMBER
  ),
  O AS (
    SELECT CASE_NUMBER, COUNT(DISTINCT(PCRDateTime)) AS OVERDOSES
    FROM ems_incidents
    WHERE OVERDOSE_CC_MOI + NALOXONE_DUMMY > 0
    GROUP BY CASE_NUMBER
  ),
  J AS (
    SELECT CASE_NUMBER, COUNT(DISTINCT(BOOKING_DATE)) AS INCARCERATIONS
    FROM incarcerations
    GROUP BY CASE_NUMBER
  ),
  H AS (
    SELECT CASE_NUMBER, COUNT(DISTINCT(ADMIT_TIME)) AS HEALTH_ENCOUNTERS
    FROM encounters
    GROUP BY CASE_NUMBER
  ),
  CN_POJH AS (
    SELECT D.CASE_NUMBER, AGE, SEX, RACE,
      coalesce(OPIOID_PRESCRIPTIONS, 0) AS OPIOID_PRESCRIPTIONS,
      coalesce(OVERDOSES, 0) AS OVERDOSES,
      coalesce(INCARCERATIONS, 0) AS INCARCERATIONS,
      coalesce(HEALTH_ENCOUNTERS, 0) AS HEALTH_ENCOUNTERS,
      strftime('%Y', DOD) || CASE
        WHEN cast(strftime('%m', DOD) as integer) BETWEEN 1 AND 3 THEN '-01-01'
        WHEN cast(strftime('%m', DOD) as integer) BETWEEN 4 and 6 THEN '-04-01'
        WHEN cast(strftime('%m', DOD) as integer) BETWEEN 7 and 9 THEN '-07-01'
        ELSE '-10-01'
      END AS "PERIOD"
    FROM deaths AS D
      LEFT OUTER JOIN P ON D.CASE_NUMBER = P.CASE_NUMBER
      LEFT OUTER JOIN O ON D.CASE_NUMBER = O.CASE_NUMBER
      LEFT OUTER JOIN J ON D.CASE_NUMBER = J.CASE_NUMBER
      LEFT OUTER JOIN H ON D.CASE_NUMBER = H.CASE_NUMBER
  )
SELECT *,
  OPIOID_PRESCRIPTIONS + OVERDOSES + INCARCERATIONS + HEALTH_ENCOUNTERS AS ALL_TYPES
FROM CN_POJH
ORDER BY CASE_NUMBER;
