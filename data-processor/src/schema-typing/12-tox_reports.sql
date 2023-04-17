DROP TABLE IF EXISTS tox_reports;

CREATE TABLE tox_reports (
  "ACCT_NUM" CHARACTER(5) CHECK(length(acct_num) = 5),
  "FENTANYL" BOOLEAN CHECK(fentanyl IN (NULL, 0, 1)),
  "BENZODIAZEPINES" BOOLEAN CHECK(benzodiazepines IN (NULL, 0, 1)),
  "METHAMPHETAMINE" BOOLEAN CHECK(methamphetamine IN (NULL, 0, 1)),
  "SEDATIVE_HYPNOTICS" BOOLEAN CHECK(sedative_hypnotics IN (NULL, 0, 1)),
  "HYDROMORPHONE" BOOLEAN CHECK(hydromorphone IN (NULL, 0, 1)),
  "OXYMORPHONE" BOOLEAN CHECK(oxymorphone IN (NULL, 0, 1)),
  "OXYCODONE" BOOLEAN CHECK(oxycodone IN (NULL, 0, 1)),
  "ANTIDEPRESSANTS" BOOLEAN CHECK(antidepressants IN (NULL, 0, 1)),
  "DOD" DATE CHECK(length(dod) = 10),
  "DOB" DATE CHECK(length(dob) = 10 OR dob IS NULL),
  "AGE" INT CHECK(typeof(age) = 'integer' OR age IS NULL),
  "GENDER" CHARACTER CHECK(gender IN (NULL, 'M', 'F'))
);
INSERT INTO tox_reports
  SELECT
    acct_num,
    CASE fentanyl
      WHEN 'Negative' THEN 0
      WHEN 'POSITIVE' THEN 1
      ELSE NULL
    END,
    CASE benzodiazepines
      WHEN 'Negative' THEN 0
      WHEN 'POSITIVE' THEN 1
      ELSE NULL
    END,
    CASE methamphetamine
      WHEN 'Negative' THEN 0
      WHEN 'POSITIVE' THEN 1
      ELSE NULL
    END,
    CASE sedative_hypnotics
      WHEN 'Negative' THEN 0
      WHEN 'POSITIVE' THEN 1
      ELSE NULL
    END,
    CASE hydromorphone
      WHEN 'Negative' THEN 0
      WHEN 'POSITIVE' THEN 1
      ELSE NULL
    END,
    CASE oxymorphone
      WHEN 'Negative' THEN 0
      WHEN 'POSITIVE' THEN 1
      ELSE NULL
    END,
    CASE oxycodone
      WHEN 'Negative' THEN 0
      WHEN 'POSITIVE' THEN 1
      ELSE NULL
    END,
    CASE antidepressants
      WHEN 'Negative' THEN 0
      WHEN 'POSITIVE' THEN 1
      ELSE NULL
    END,
    date(dod) as dod,
    date(substr(__Date_of_Birth_, 7, 4) || '-' || substr(__Date_of_Birth_, 4, 2) || '-' || substr(__Date_of_Birth_, 1, 2)) AS dob,
    CAST((JULIANDAY(date(dod)) - JULIANDAY(date(substr(__Date_of_Birth_, 7, 4) || '-' || substr(__Date_of_Birth_, 4, 2) || '-' || substr(__Date_of_Birth_, 1, 2))))/365 as INT) AS age,
    CASE gender
      WHEN 'M' THEN 'M'
      WHEN 'F' THEN 'F'
      ELSE NULL
    END
FROM tox_reports_raw;

CREATE INDEX tox_reports_fk ON tox_reports("ACCT_NUM");
