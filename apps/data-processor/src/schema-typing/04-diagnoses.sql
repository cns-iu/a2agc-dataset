-- Diagnoses (Long Datasets/od_diagnosis_long.csv) --
DROP TABLE IF EXISTS diagnoses;
CREATE TABLE diagnoses (
  "CASE_NUMBER" CHARACTER(6) NOT NULL CHECK(length(case_number) = 6 OR case_number = '172987a'),
      -- FIXME: case_number = 172987a is the only row that is not length 6 and is a duplicate of 172987 
  "DOD" DATE NOT NULL CHECK((typeof(dod) = 'text' AND length(dod) = 10)),
  "CODE_SYSTEM" VARCHAR(5) NOT NULL CHECK(code_system IN ('ICD9', 'ICD10')),
  "CODE_NAME" VARCHAR(512) CHECK(length(code_name) BETWEEN 1 AND 512 OR code_name IS NULL),
      -- NOTE: One row has '' as a code_name. Translated to NULL.
  "PHYS_TIME" DATE NOT NULL CHECK((typeof(phys_time) = 'text' AND length(phys_time) = 10)),
  "SUD_DX_FLAG" BOOLEAN NOT NULL CHECK(sud_dx_flag IN (0, 1)),
  "OPIOID_DX_FLAG" BOOLEAN NOT NULL CHECK(sud_dx_flag IN (0, 1)),
  "SHORT_DESC" VARCHAR(128) CHECK(length(short_desc) BETWEEN 2 AND 128 OR short_desc IS NULL),
      -- NOTE: ~16k rows have '' as a short_desc. Translated to NULL.
  "LONG_DESC" VARCHAR(256) CHECK(length(long_desc) BETWEEN 2 AND 256 OR long_desc IS NULL),
      -- NOTE: ~16k rows have '' as a long_desc. Translated to NULL.
  "THREE_DIGIT" VARCHAR(3) CHECK(length(three_digit) BETWEEN 1 AND 3 OR three_digit IS NULL),
      -- Note: Some three digit codes... Are not three digits... 70, 11, 9, 38, 31, 41, and 3...
  "MAJOR" VARCHAR(256) CHECK(length(major) BETWEEN 2 AND 256 OR major IS NULL),
  "SUB_CHAPTER" VARCHAR(256) CHECK(length(sub_chapter) BETWEEN 2 AND 256 OR sub_chapter IS NULL),
  "CHAPTER" VARCHAR(128) CHECK(length(chapter) BETWEEN 2 AND 128 OR chapter IS NULL),
  "STUDY_TEAM_CODE_USE" BOOLEAN NOT NULL CHECK(study_team_code_use IN (0, 1)),
  FOREIGN KEY("CASE_NUMBER") REFERENCES deaths("CASE_NUMBER")
);
INSERT INTO diagnoses
  SELECT case_number,
    date(dod),
    code_system,
    CASE code_name WHEN '' THEN NULL ELSE code_name END,
    date(phys_time),
    CASE sud_dx_flag WHEN '' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE opioid_dx_flag WHEN '' THEN false WHEN '1' THEN true ELSE NULL END,
    NULLIF(short_desc, ''),
    NULLIF(long_desc, ''),
    NULLIF(three_digit, ''),
    NULLIF(major, ''),
    NULLIF(sub_chapter, ''),
    NULLIF(chapter, ''),
    CASE study_team_code_use WHEN '' THEN false WHEN '1' THEN true ELSE NULL END
  FROM od_diagnosis_long_raw;
CREATE INDEX diagnoses_fk ON diagnoses("CASE_NUMBER");
