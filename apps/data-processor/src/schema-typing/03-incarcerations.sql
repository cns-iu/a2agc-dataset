-- Incarcerations (Long Datasets/Linked_Jail_Data.csv) --
DROP TABLE IF EXISTS incarcerations;
CREATE TABLE incarcerations (
  "JAIL_ID" INT NOT NULL CHECK(typeof(jail_id) == 'integer'),
  "CASE_NUMBER" CHARACTER(6) NOT NULL CHECK(length(case_number) = 6 OR case_number = '172987a'),
      -- FIXME: case_number = 172987a is the only row that is not length 6 and is a duplicate of 172987 
  "ADMISSION" VARCHAR(32) NOT NULL CHECK(length(admission) BETWEEN 1 AND 32),
      -- Note: the data dictionary shows they are numbers, but these are the mapped strings
  "PERMANENT_NO" INT NOT NULL CHECK(typeof(permanent_no) == 'integer'),
  "BOOKING_NO" INT NOT NULL CHECK(typeof(booking_no) == 'integer'),
  "LAST_NAME" VARCHAR(32) NOT NULL CHECK(length(last_name) BETWEEN 1 AND 32),
  "FIRST_NAME" VARCHAR(32) NOT NULL CHECK(length(first_name) BETWEEN 1 AND 32),
  "MIDDLE_NAME" VARCHAR(16) CHECK(length(middle_name) BETWEEN 1 AND 16 OR middle_name IS NULL),
      -- Note: Some middle_names were just a single space. Translated this to NULL.
  "OFFENSE_DESCRIPTION" VARCHAR(128) NOT NULL CHECK(length(offense_description) BETWEEN 2 AND 128),
  "JAIL_CASE_NUMBER" VARCHAR(24) CHECK(length(jail_case_number) BETWEEN 2 AND 24 OR jail_case_number IS NULL),
      -- Note: Some jail_case_numbers were just a single space. Translated this to NULL.
  "GENDER" CHARACTER NOT NULL CHECK(gender = 'M' OR gender = 'F'),
      -- Note: Translated Male/Female to M/F
  "DOB" DATE NOT NULL CHECK((typeof(dob) = 'text' AND length(dob) = 10)),
  "YOB" INT NOT NULL CHECK(typeof(yob) = 'integer'),
  "AGE" REAL NOT NULL CHECK(typeof(age) = 'real' AND age BETWEEN 10 AND 120),
  "RACE" VARCHAR(12) NOT NULL CHECK(length(race) BETWEEN 1 AND 32),
  "BOOKING_DATE" DATE NOT NULL CHECK((typeof(booking_date) = 'text' AND length(booking_date) = 10)),
  "BOOKING_YEAR" INT NOT NULL CHECK(typeof(booking_year) = 'integer'),
  "RELEASE_DATE" DATE NOT NULL CHECK((typeof(release_date) = 'text' AND length(release_date) = 10)),
  "RELEASE_YEAR" INT NOT NULL CHECK(typeof(release_year) = 'integer'),
  "MIN_BOOKING_DATE" DATE NOT NULL CHECK((typeof(min_booking_date) = 'text' AND length(min_booking_date) = 10)),
  "MAX_RELEASE_DATE" DATE NOT NULL CHECK((typeof(max_release_date) = 'text' AND length(max_release_date) = 10)),
  FOREIGN KEY("CASE_NUMBER") REFERENCES deaths("CASE_NUMBER")
);
INSERT INTO incarcerations
  SELECT CAST(jail_id AS INT),
    case_number,
    admission, 
    CAST(permanent_no AS INT),
    CAST(booking_no AS INT),
    last_name,
    first_name,
    CASE middle_name WHEN ' ' THEN NULL ELSE middle_name END,
    offense_description,
    CASE jail_case_number WHEN ' ' THEN NULL ELSE jail_case_number END,
    CASE gender WHEN 'Female' THEN 'F' WHEN 'Male' THEN 'M' ELSE NULL END,
    date(dob),
    CAST(yob AS INT),
    CAST(age AS REAL),
    race,
    booking_date,
    CAST(booking_year AS INT),
    release_date,
    CAST(release_year AS INT),
    min_booking_date,
    max_release_date
  FROM Linked_Jail_Data_raw;
CREATE INDEX incarcerations_fk ON incarcerations("CASE_NUMBER");
