 
DROP TABLE IF EXISTS OVERDOSE_AGG;
CREATE TEMP TABLE OVERDOSE_AGG AS
	SELECT
		*
	FROM deaths as d
	LEFT JOIN ems_incidents as e
	ON d.CASE_NUMBER = e.CASE_NUMBER;

SELECT
	CASE_NUMBER,
  SEX,
	'All Substances' AS SUBSTANCE_NAME,
	CAST((AGE / 10) AS INT) AS AGE_GROUP,
	DOD as DATE_OF_DEATH,
	YEAR,
	OVERDOSE_DUMMY,
	OVERDOSE_CC_MOI,
	MIN_INCIDENT_DATE,
	MAX_INCIDENT_DATE
FROM OVERDOSE_AGG

UNION

SELECT
	CASE_NUMBER,
  SEX,
	'Heroin' AS SUBSTANCE_NAME,
	CAST((AGE / 10) AS INT) AS AGE_GROUP,
	DOD as DATE_OF_DEATH,
	YEAR,
	OVERDOSE_DUMMY,
	OVERDOSE_CC_MOI,
	MIN_INCIDENT_DATE,
	MAX_INCIDENT_DATE
FROM OVERDOSE_AGG
WHERE ANY_HEROIN == 1

UNION

SELECT
	CASE_NUMBER,
  SEX,
	'Cocaine' AS SUBSTANCE_NAME,
	CAST((AGE / 10) AS INT) AS AGE_GROUP,
	DOD as DATE_OF_DEATH,
	YEAR,
	OVERDOSE_DUMMY,
	OVERDOSE_CC_MOI,
	MIN_INCIDENT_DATE,
	MAX_INCIDENT_DATE
FROM OVERDOSE_AGG
WHERE ANY_COCAINE == 1

UNION

SELECT
	CASE_NUMBER,
  SEX,
	'Fentanyl' AS SUBSTANCE_NAME,
	CAST((AGE / 10) AS INT) AS AGE_GROUP,
	DOD as DATE_OF_DEATH,
	YEAR,
	OVERDOSE_DUMMY,
	OVERDOSE_CC_MOI,
	MIN_INCIDENT_DATE,
	MAX_INCIDENT_DATE
FROM OVERDOSE_AGG
WHERE ANY_FENTANYL == 1

UNION

SELECT
	CASE_NUMBER,
  SEX,
	'Prescription Opioid' AS SUBSTANCE_NAME,
	CAST((AGE / 10) AS INT) AS AGE_GROUP,
	DOD as DATE_OF_DEATH,
	YEAR,
	OVERDOSE_DUMMY,
	OVERDOSE_CC_MOI,
	MIN_INCIDENT_DATE,
	MAX_INCIDENT_DATE
FROM OVERDOSE_AGG
WHERE ANY_PRESCRIPTION_OPIOID == 1

UNION

SELECT
	CASE_NUMBER,
  SEX,
	'Any Opioid' AS SUBSTANCE_NAME,
	CAST((AGE / 10) AS INT) AS AGE_GROUP,
	DOD as DATE_OF_DEATH,
	YEAR,
	OVERDOSE_DUMMY,
	OVERDOSE_CC_MOI,
	MIN_INCIDENT_DATE,
	MAX_INCIDENT_DATE
FROM OVERDOSE_AGG
WHERE ANY_OPIOID == 1

UNION

SELECT
	CASE_NUMBER,
  SEX,
	'Benzodiazepine' AS SUBSTANCE_NAME,
	CAST((AGE / 10) AS INT) AS AGE_GROUP,
	DOD as DATE_OF_DEATH,
	YEAR,
	OVERDOSE_DUMMY,
	OVERDOSE_CC_MOI,
	MIN_INCIDENT_DATE,
	MAX_INCIDENT_DATE
FROM OVERDOSE_AGG
WHERE ANY_BENZODIAZEPINE == 1

UNION

SELECT
	CASE_NUMBER,
  SEX,
	'Methamphetamine' AS SUBSTANCE_NAME,
	CAST((AGE / 10) AS INT) AS AGE_GROUP,
	DOD as DATE_OF_DEATH,
	YEAR,
	OVERDOSE_DUMMY,
	OVERDOSE_CC_MOI,
	MIN_INCIDENT_DATE,
	MAX_INCIDENT_DATE
FROM OVERDOSE_AGG
WHERE ANY_METHAMPHETAMINE == 1