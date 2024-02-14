-- Medications Prescribed (Long Datasets/od_medication_long.csv) --
DROP TABLE IF EXISTS medications;
CREATE TABLE medications (
  "CASE_NUMBER" CHARACTER(6) NOT NULL CHECK(length(case_number) = 6 OR case_number = '172987a'),
      -- FIXME: case_number = 172987a is the only row that is not length 6 and is a duplicate of 172987 
  "DOD" DATE NOT NULL CHECK((typeof(dod) = 'text' AND length(dod) = 10)),
  "PHYS_TIME" DATE NOT NULL CHECK((typeof(phys_time) = 'text' AND length(phys_time) = 10)),
  "DRUG_NAME" VARCHAR(64) CHECK(length(drug_name) BETWEEN 1 AND 64 OR drug_name IS NULL),
      -- NOTE: 3,350 rows have '' as a value_text_for_display. Translated to NULL.
  "PRESCRIBER_NUMBER" VARCHAR(16) CHECK(length(prescriber_number) BETWEEN 1 AND 16 OR prescriber_number IS NULL),
      -- NOTE: 73,843 rows have '' as a value_text_for_display. Translated to NULL.
  "DISPENSE_AMOUNT" REAL NOT NULL CHECK(typeof(dispense_amount) = 'real'),
      -- NOTE: There are negative amounts? Why?
  "NUMBER_OF_DAYS_SUPPLY" INT NOT NULL CHECK(typeof(number_of_days_supply) = 'integer'),
  "NDC_CODE" CHARACTER(11) NOT NULL CHECK(length(ndc_code) = 11),
  "GPI_GENERIC_NAME" VARCHAR(64) NOT NULL CHECK(length(gpi_generic_name) BETWEEN 2 AND 64),
  "DRUG_CLASS_NAME" VARCHAR(64) NOT NULL CHECK(length(drug_class_name) BETWEEN 2 AND 64),
  "DRUG_SUB_CLASS_NAME" VARCHAR(64) NOT NULL CHECK(length(drug_sub_class_name) BETWEEN 2 AND 64),
  "STUDY_TEAM_CODE_USE" BOOLEAN NOT NULL CHECK(study_team_code_use IN (0, 1)),
  "STUDY_TEAM_CODING" VARCHAR(32) CHECK(length(study_team_coding) BETWEEN 2 AND 32 OR study_team_coding IS NULL),
      -- NOTE: 116,087 rows have '' as a study_team_coding. Translated to NULL.
  "OPIOID_FLAG" BOOLEAN NOT NULL CHECK(opioid_flag IN (0, 1)),
  "BENZO_FLAG" BOOLEAN NOT NULL CHECK(benzo_flag IN (0, 1)),
  FOREIGN KEY("CASE_NUMBER") REFERENCES deaths("CASE_NUMBER")
);
INSERT INTO medications
  SELECT case_number,
    date(dod),
    date(phys_time),
    NULLIF(drug_name, ''),
    NULLIF(prescriber_number, ''),
    CAST(dispense_amount AS REAL),
    CAST(number_of_days_supply AS INT),
    ndc_code,
    gpi_generic_name,
    drug_class_name,
    drug_sub_class_name,
    CASE study_team_code_use WHEN '' THEN false WHEN '1' THEN true ELSE NULL END,
    NULLIF(study_team_coding, ''),
    CASE opioid_flag WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE benzo_flag WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END
  FROM od_medication_long_raw;
CREATE INDEX medications_fk ON medications("CASE_NUMBER");
