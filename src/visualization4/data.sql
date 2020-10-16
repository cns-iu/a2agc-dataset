 
SELECT
	CASE_NUMBER,
  SEX,
	'All Substances' AS SUBSTANCE_NAME,
	CAST((AGE / 5) AS INT) AS AGE_GROUP,
	DOD as DATE_OF_DEATH,
	YEAR
FROM deaths

UNION

SELECT
	CASE_NUMBER,
  SEX,
	'Heroin' AS SUBSTANCE_NAME,
	CAST((AGE / 5) AS INT) AS AGE_GROUP,
	DOD as DATE_OF_DEATH,
	YEAR
FROM deaths
WHERE ANY_HEROIN == 1

UNION

SELECT
	CASE_NUMBER,
    SEX,
	'Cocaine' AS SUBSTANCE_NAME,
	CAST((AGE / 5) AS INT) AS AGE_GROUP,
	DOD as DATE_OF_DEATH,
	YEAR
FROM deaths
WHERE ANY_COCAINE == 1

UNION

SELECT
	CASE_NUMBER,
  SEX,
	'Fentanyl' AS SUBSTANCE_NAME,
	CAST((AGE / 5) AS INT) AS AGE_GROUP,
	DOD as DATE_OF_DEATH,
	YEAR
FROM deaths
WHERE ANY_FENTANYL == 1

UNION

SELECT
	CASE_NUMBER,
  SEX,
	'Prescription Opioid' AS SUBSTANCE_NAME,
	CAST((AGE / 5) AS INT) AS AGE_GROUP,
	DOD as DATE_OF_DEATH,
	YEAR
FROM deaths
WHERE ANY_PRESCRIPTION_OPIOID == 1

UNION

SELECT
	CASE_NUMBER,
  SEX,
	'Any Opioid' AS SUBSTANCE_NAME,
	CAST((AGE / 5) AS INT) AS AGE_GROUP,
	DOD as DATE_OF_DEATH,
	YEAR
FROM deaths
WHERE ANY_OPIOID == 1

UNION

SELECT
	CASE_NUMBER,
  SEX,
	'Benzodiazepine' AS SUBSTANCE_NAME,
	CAST((AGE / 5) AS INT) AS AGE_GROUP,
	DOD as DATE_OF_DEATH,
	YEAR
FROM deaths
WHERE ANY_BENZODIAZEPINE == 1

UNION

SELECT
	CASE_NUMBER,
  SEX,
	'Methamphetamine' AS SUBSTANCE_NAME,
	CAST((AGE / 5) AS INT) AS AGE_GROUP,
	DOD as DATE_OF_DEATH,
	YEAR
FROM deaths
WHERE ANY_METHAMPHETAMINE == 1