-- Hospital Encounters (Long Datasets/od_encounters_long.csv) --
DROP TABLE IF EXISTS encounters;
CREATE TABLE encounters (
  "CASE_NUMBER" CHARACTER(6) NOT NULL CHECK(length(case_number) = 6 OR case_number = '172987a'),
      -- FIXME: case_number = 172987a is the only row that is not length 6 and is a duplicate of 172987
  "DOD" DATE NOT NULL CHECK((typeof(dod) = 'text' AND length(dod) = 10)),
  "ENCOUNTER_ID" INT NOT NULL CHECK(typeof(encounter_id) == 'integer'), -- PRIMARY KEY,
  "ADMIT_TIME" DATE NOT NULL CHECK((typeof(admit_time) = 'text' AND length(admit_time) = 10)),
  "DISCHARGE_TIME" DATE CHECK((typeof(discharge_time) = 'text' AND length(discharge_time) = 10) OR discharge_time IS NULL),
  "CARE_SETTING_CODE" CHARACTER NOT NULL CHECK(care_setting_code IN ('E', 'O', 'I')),
  FOREIGN KEY("CASE_NUMBER") REFERENCES deaths("CASE_NUMBER")
);
INSERT INTO encounters
  SELECT case_number,
    date(dod),
    CAST(encounter_id AS INT),
    date(admit_time),
    date(NULLIF(discharge_time, '')),
    care_setting_code
  FROM od_encounters_long_raw;
CREATE INDEX encounters_fk ON encounters("CASE_NUMBER");
