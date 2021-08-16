WITH
  DNULL AS (
    SELECT CASE_NUMBER,
    -- DOD AS "PERIOD", -- Daily periodicity
      -- SUBSTR(DOD, 0, 8) || '-01'  AS "PERIOD", -- Monthly periodicity
      strftime('%Y', DOD) || CASE
        WHEN cast(strftime('%m', DOD) as integer) BETWEEN 1 AND 3 THEN '-01-01'
        WHEN cast(strftime('%m', DOD) as integer) BETWEEN 4 and 6 THEN '-04-01'
        WHEN cast(strftime('%m', DOD) as integer) BETWEEN 7 and 9 THEN '-07-01'
        ELSE '-10-01'
      END AS "PERIOD",
      0 AS OPIOID_PRESCRIPTIONS, 0 AS OVERDOSES, 0 AS INCARCERATIONS, 1 AS HEALTH_ENCOUNTERS
    FROM deaths
  ),
  P AS (
    SELECT CASE_NUMBER,
      -- PHYS_TIME AS "PERIOD", -- Daily periodicity
      -- SUBSTR(PHYS_TIME, 0, 8) || '-01'  AS "PERIOD", -- Monthly periodicity
      strftime('%Y', PHYS_TIME) || CASE
        WHEN cast(strftime('%m', PHYS_TIME) as integer) BETWEEN 1 AND 3 THEN '-01-01'
        WHEN cast(strftime('%m', PHYS_TIME) as integer) BETWEEN 4 and 6 THEN '-04-01'
        WHEN cast(strftime('%m', PHYS_TIME) as integer) BETWEEN 7 and 9 THEN '-07-01'
        ELSE '-10-01'
      END AS "PERIOD",
      COUNT(DISTINCT(PHYS_TIME)) AS OPIOID_PRESCRIPTIONS, 0 AS OVERDOSES, 0 AS INCARCERATIONS, 0 AS HEALTH_ENCOUNTERS
    FROM medications
    WHERE OPIOID_FLAG + BENZO_FLAG > 0
    GROUP BY CASE_NUMBER, PERIOD
  ),
  O AS (
    SELECT CASE_NUMBER,
      -- PCRDateTime AS "PERIOD", -- Daily periodicity
      -- SUBSTR(PCRDateTime, 0, 8) || '-01'  AS "PERIOD", -- Monthly periodicity
      strftime('%Y', PCRDateTime) || CASE
        WHEN cast(strftime('%m', PCRDateTime) as integer) BETWEEN 1 AND 3 THEN '-01-01'
        WHEN cast(strftime('%m', PCRDateTime) as integer) BETWEEN 4 and 6 THEN '-04-01'
        WHEN cast(strftime('%m', PCRDateTime) as integer) BETWEEN 7 and 9 THEN '-07-01'
        ELSE '-10-01'
      END AS "PERIOD",
      0 AS OPIOID_PRESCRIPTIONS, COUNT(DISTINCT(PCRDateTime)) AS OVERDOSES, 0 AS INCARCERATIONS, 0 AS HEALTH_ENCOUNTERS
    FROM ems_incidents
    WHERE OVERDOSE_CC_MOI + NALOXONE_DUMMY > 0
    GROUP BY CASE_NUMBER, PERIOD
  ),
  J AS (
    SELECT CASE_NUMBER,
      -- BOOKING_DATE AS "PERIOD", -- Daily periodicity
      -- SUBSTR(BOOKING_DATE, 0, 8) || '-01'  AS "PERIOD", -- Monthly periodicity
      strftime('%Y', BOOKING_DATE) || CASE
        WHEN cast(strftime('%m', BOOKING_DATE) as integer) BETWEEN 1 AND 3 THEN '-01-01'
        WHEN cast(strftime('%m', BOOKING_DATE) as integer) BETWEEN 4 and 6 THEN '-04-01'
        WHEN cast(strftime('%m', BOOKING_DATE) as integer) BETWEEN 7 and 9 THEN '-07-01'
        ELSE '-10-01'
      END AS "PERIOD",
      0 AS OPIOID_PRESCRIPTIONS, 0 AS OVERDOSES, COUNT(DISTINCT(BOOKING_DATE)) AS INCARCERATIONS, 0 AS HEALTH_ENCOUNTERS
    FROM incarcerations
    GROUP BY CASE_NUMBER, PERIOD
  ),
  H AS (
    SELECT CASE_NUMBER,
      -- ADMIT_TIME AS "PERIOD", -- Daily periodicity
      -- SUBSTR(ADMIT_TIME, 0, 8) || '-01'  AS "PERIOD", -- Monthly periodicity
      strftime('%Y', ADMIT_TIME) || CASE
        WHEN cast(strftime('%m', ADMIT_TIME) as integer) BETWEEN 1 AND 3 THEN '-01-01'
        WHEN cast(strftime('%m', ADMIT_TIME) as integer) BETWEEN 4 and 6 THEN '-04-01'
        WHEN cast(strftime('%m', ADMIT_TIME) as integer) BETWEEN 7 and 9 THEN '-07-01'
        ELSE '-10-01'
      END AS "PERIOD",
      0 AS OPIOID_PRESCRIPTIONS, 0 AS OVERDOSES, 0 AS INCARCERATIONS, COUNT(DISTINCT(ADMIT_TIME)) AS HEALTH_ENCOUNTERS
    FROM encounters
    GROUP BY CASE_NUMBER, PERIOD
  ),
  POJH AS (
    SELECT CASE_NUMBER, PERIOD,
      SUM(OPIOID_PRESCRIPTIONS) AS OPIOID_PRESCRIPTIONS,
      SUM(OVERDOSES) AS OVERDOSES,
      SUM(INCARCERATIONS) AS INCARCERATIONS,
      SUM(HEALTH_ENCOUNTERS) AS HEALTH_ENCOUNTERS,
      SUM(OPIOID_PRESCRIPTIONS + OVERDOSES + INCARCERATIONS + HEALTH_ENCOUNTERS) AS ALL_TYPES
    FROM (
      SELECT * FROM DNULL
      UNION ALL SELECT * FROM P
      UNION ALL SELECT * FROM O
      UNION ALL SELECT * FROM J
      UNION ALL SELECT * FROM H
    ) AS Z
    GROUP BY CASE_NUMBER, PERIOD
  ),
  POJH_RANK AS (
    SELECT CASE_NUMBER, SUM(ALL_TYPES) AS RANK0 -- COUNT(*) AS RANK0
    FROM POJH
    GROUP BY CASE_NUMBER
  ),
  CN_POJH AS (
    SELECT D.CASE_NUMBER, POJH.PERIOD,
      -(RANK0 * 1000000 + D.CASE_NUMBER) AS RANK,
      DOD, AGE, SEX, RACE, OPIOID_PRESCRIPTIONS, OVERDOSES, INCARCERATIONS, HEALTH_ENCOUNTERS, ALL_TYPES
    FROM POJH INNER JOIN deaths AS D ON (POJH.CASE_NUMBER = D.CASE_NUMBER)
      INNER JOIN POJH_RANK ON (POJH.CASE_NUMBER = POJH_RANK.CASE_NUMBER)
  )
SELECT *
FROM CN_POJH
ORDER BY RANK ASC, PERIOD ASC;
