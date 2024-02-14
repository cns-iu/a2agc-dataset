-- Procedures done (Long Datasets/od_procedures_long.csv) --
DROP TABLE IF EXISTS procedures;
CREATE TABLE procedures (
  "CASE_NUMBER" CHARACTER(6) NOT NULL CHECK(length(case_number) = 6 OR case_number = '172987a'),
      -- FIXME: case_number = 172987a is the only row that is not length 6 and is a duplicate of 172987 
  "DOD" DATE NOT NULL CHECK((typeof(dod) = 'text' AND length(dod) = 10)),
  "PHYS_TIME" DATE NOT NULL CHECK((typeof(phys_time) = 'text' AND length(phys_time) = 10)),
  "CPT4_CODE" CHARACTER(5) NOT NULL CHECK(length(cpt4_code) = 5),
  "CODE_NAME" VARCHAR(32) NOT NULL CHECK(length(code_name) BETWEEN 2 AND 32),
  "STUDY_TEAM_CODE_USE" BOOLEAN NOT NULL CHECK(study_team_code_use IN (0, 1)),
  FOREIGN KEY("CASE_NUMBER") REFERENCES deaths("CASE_NUMBER")
);
INSERT INTO procedures
  SELECT case_number,
    date(dod),
    date(phys_time),
    cpt4_code,
    code_name,
    CASE study_team_code_use WHEN '' THEN false WHEN '1' THEN true ELSE NULL END
  FROM od_procedures_long_raw;
CREATE INDEX procedures_fk ON procedures("CASE_NUMBER");
