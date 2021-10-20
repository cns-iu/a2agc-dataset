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
  HEALTH_RANK AS (
    SELECT CASE_NUMBER, SUM(HEALTH_ENCOUNTERS) AS TOTAL_HEALTH
    FROM POJH
    GROUP BY CASE_NUMBER
  ),
  OVERDOSE_RANK AS (
    SELECT CASE_NUMBER, SUM(OVERDOSES) AS TOTAL_OVERDOSE
    FROM POJH
    GROUP BY CASE_NUMBER
  ),
  INCARCERATIONS_RANK AS (
    SELECT CASE_NUMBER, SUM(INCARCERATIONS) AS TOTAL_INCARCERATIONS
    FROM POJH
    GROUP BY CASE_NUMBER
  ),
  PRESCRIPTIONS_RANK AS (
    SELECT CASE_NUMBER, SUM(OPIOID_PRESCRIPTIONS) AS TOTAL_PRESCRIPTIONS
    FROM POJH
    GROUP BY CASE_NUMBER
  ),
  CN_POJH AS (
    SELECT D.CASE_NUMBER, POJH.PERIOD,
      -(RANK0 * 1000000 + D.CASE_NUMBER) AS RANK,
      TOTAL_HEALTH,
      -(TOTAL_HEALTH * 1000000 + D.CASE_NUMBER) AS HEALTH_RANK,
      TOTAL_OVERDOSE,
      -(TOTAL_OVERDOSE * 1000000 + D.CASE_NUMBER) AS OVERDOSE_RANK,
      TOTAL_INCARCERATIONS,
      -(TOTAL_INCARCERATIONS * 1000000 + D.CASE_NUMBER) AS INCARCERATIONS_RANK,
      TOTAL_PRESCRIPTIONS,
      -(TOTAL_PRESCRIPTIONS * 1000000 + D.CASE_NUMBER) AS PRESCRIPTIONS_RANK,
      -(AGE * 1000000 + D.CASE_NUMBER) AS AGE_RANK,
      DOD, AGE, SEX, RACE, OPIOID_PRESCRIPTIONS, OVERDOSES, INCARCERATIONS, HEALTH_ENCOUNTERS, ALL_TYPES,
      CASE OVERDOSES
        WHEN 0 THEN '9999-01-01'
        ELSE PERIOD
      END as TIME_OF_OD,
      CASE OPIOID_PRESCRIPTIONS
        WHEN 0 THEN '9999-01-01'
        ELSE PERIOD
      END as TIME_OF_RX
    FROM POJH INNER JOIN deaths AS D ON (POJH.CASE_NUMBER = D.CASE_NUMBER)
      INNER JOIN POJH_RANK ON (POJH.CASE_NUMBER = POJH_RANK.CASE_NUMBER)
      INNER JOIN HEALTH_RANK ON (POJH.CASE_NUMBER = HEALTH_RANK.CASE_NUMBER)
      INNER JOIN OVERDOSE_RANK ON (POJH.CASE_NUMBER = OVERDOSE_RANK.CASE_NUMBER)
      INNER JOIN INCARCERATIONS_RANK ON (POJH.CASE_NUMBER = INCARCERATIONS_RANK.CASE_NUMBER)
      INNER JOIN PRESCRIPTIONS_RANK ON (POJH.CASE_NUMBER = PRESCRIPTIONS_RANK.CASE_NUMBER)
  ),
  FINAL AS (
    SELECT *,
      MIN(TIME_OF_OD) OVER(PARTITION BY CASE_NUMBER) AS TIME_FIRST_OD,
      MIN(TIME_OF_RX) OVER(PARTITION BY CASE_NUMBER) AS TIME_FIRST_RX,
      CASE
        WHEN julianday(DOD) - julianday(MIN(TIME_OF_OD) OVER(PARTITION BY CASE_NUMBER)) >= 0 THEN -(julianday(DOD) - julianday(MIN(TIME_OF_OD) OVER(PARTITION BY CASE_NUMBER)))
        ELSE 0
      END AS OD_DIFF,
      CASE
        WHEN julianday(DOD) - julianday(MIN(TIME_OF_RX) OVER(PARTITION BY CASE_NUMBER)) >= 0 THEN -(julianday(DOD) - julianday(MIN(TIME_OF_RX) OVER(PARTITION BY CASE_NUMBER)))
        ELSE 0
      END AS RX_DIFF
    FROM CN_POJH
  )
SELECT *
FROM FINAL
GROUP BY CASE_NUMBER, PERIOD
ORDER BY RANK ASC, PERIOD ASC