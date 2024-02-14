-- Labs (Long Datasets/od_lab_long.csv) --
DROP TABLE IF EXISTS labs;
CREATE TABLE labs (
  "CASE_NUMBER" CHARACTER(6) NOT NULL CHECK(length(case_number) = 6 OR case_number = '172987a'),
      -- FIXME: case_number = 172987a is the only row that is not length 6 and is a duplicate of 172987 
  "DOD" DATE NOT NULL CHECK((typeof(dod) = 'text' AND length(dod) = 10)),
  "LAB_NAME" VARCHAR(64) NOT NULL CHECK(length(lab_name) BETWEEN 2 AND 64),
  "PHYS_TIME" DATE NOT NULL CHECK((typeof(phys_time) = 'text' AND length(phys_time) = 10)),
  "CODE_VALUE" VARCHAR(2048) CHECK(length(code_value) BETWEEN 1 AND 2048 OR code_value IS NULL),
      -- NOTE: 1850 rows have '' as a code_value. Translated to NULL.
  "CODE_VALUE_TYPE" CHARACTER CHECK(code_value_type IN ('T', 'N', 'C') OR code_value_type IS NULL),
      -- NOTE: 665 rows have '' as a code_value_type. Translated to NULL.
  "VALUE_TEXT_FOR_DISPLAY" VARCHAR(2048) CHECK(length(value_text_for_display) BETWEEN 1 AND 2048 OR value_text_for_display IS NULL),
      -- NOTE: 1847 rows have '' as a value_text_for_display. Translated to NULL.
  "NORMAL_RANGE_TEXT" VARCHAR(64) CHECK(length(normal_range_text) BETWEEN 1 AND 64 OR normal_range_text IS NULL),
      -- NOTE: 19,467 rows have '' as a value_text_for_display. Translated to NULL.
  "LOINC_LAB_TYPE" VARCHAR(64) NOT NULL CHECK(length(loinc_lab_type) BETWEEN 2 AND 64),
  "LOINC_TEST_TYPE" VARCHAR(16) NOT NULL CHECK(length(loinc_test_type) BETWEEN 2 AND 16),
  "LOINC_CODE" VARCHAR(8) NOT NULL CHECK(length(loinc_code) BETWEEN 6 AND 7 AND loinc_code GLOB '[0-9]*-[0-9]*'),
  "LOINC_NAME" VARCHAR(64) NOT NULL CHECK(length(loinc_name) BETWEEN 2 AND 64),
  FOREIGN KEY("CASE_NUMBER") REFERENCES deaths("CASE_NUMBER")
);
INSERT INTO labs
  SELECT case_number,
    date(dod),
    lab_name,
    date(phys_time),
    NULLIF(code_value, ''),
    NULLIF(code_value_type, ''),
    NULLIF(value_text_for_display, ''),
    NULLIF(normal_range_text, ''),
    loinc_lab_type,
    loinc_test_type,
    loinc_code,
    loinc_name
  FROM od_lab_long_raw;
CREATE INDEX labs_fk ON labs("CASE_NUMBER");
