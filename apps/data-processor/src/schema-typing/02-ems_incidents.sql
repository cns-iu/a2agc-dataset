-- EMS Incidents (Long Datasets/Linked_EMS_Data.csv) --
DROP TABLE IF EXISTS ems_incidents;
CREATE TABLE ems_incidents (
  "EMS_ID" INT NOT NULL CHECK(typeof(ems_id) == 'integer'), -- PRIMARY KEY,
  "CASE_NUMBER" CHARACTER(6) NOT NULL CHECK(length(case_number) = 6 OR case_number = '172987a'),
      -- FIXME: case_number = 172987a is the only row that is not length 6 and is a duplicate of 172987
  "YEAR" INT NOT NULL CHECK(typeof(year) = 'integer'),
  "YOB" INT NOT NULL CHECK(typeof(yob) = 'integer'),
  "PatientID" VARCHAR(64) NOT NULL CHECK(length(last_name) BETWEEN 1 AND 64),
  "LAST" VARCHAR(32) NOT NULL CHECK(length(last) BETWEEN 1 AND 32),
  "FIRST" VARCHAR(32) NOT NULL CHECK(length(first) BETWEEN 1 AND 32),
  "DOB" DATE NOT NULL CHECK((typeof(dob) = 'text' AND length(dob) = 10)),
  "MiddleName" VARCHAR(16) CHECK(length(middlename) BETWEEN 1 AND 16 OR middlename IS NULL),
      -- Note: Some middlenames were just a single space. Translated this to NULL.
  "GENDER" CHARACTER NOT NULL CHECK(gender = 'M' OR gender = 'F'),
      -- Note: Translated Male/Female to M/F
  "Race_Ethnicity" CHARACTER NOT NULL CHECK(length(race_ethnicity) = 1),
      -- FIXME: Need to know what race_ethnicity numbers map to
  "RACE_ONLY" CHARACTER NOT NULL CHECK(race_only IN (NULL, 'White', 'Black', 'Hispanic')),
  "PCRDateTime" DATE NOT NULL CHECK((typeof(pcrdatetime) = 'text' AND length(pcrdatetime) = 10)),
  "IncidentNumber" INT CHECK(typeof(incidentnumber) = 'integer' OR incidentnumber IS NULL),
      -- Note: 6 incidents have no incident number...
  "IncidentLocationTypeAll_TEXT" VARCHAR(32) NOT NULL CHECK(length(incidentlocationtypeall_text) BETWEEN 1 AND 32),
  "IncidentLocationTypeAll_CATEGORIES" CHARACTER NOT NULL CHECK(length(incidentlocationtypeall_categories) BETWEEN 1 AND 2),
      -- FIXME: Need to know what IncidentLocationTypeAll_CATEGORIES numbers map to
  "IncidentAddressLine1_A" VARCHAR(48) CHECK(length(incidentaddressline1_a) BETWEEN 1 AND 48 OR incidentaddressline1_a IS NULL),
  "IncidentAddressLine2_A" VARCHAR(32) CHECK(length(incidentaddressline2_a) BETWEEN 1 AND 32 OR incidentaddressline2_a IS NULL),
  "IncidentState" CHARACTER(2) NOT NULL CHECK(length(incidentstate) = 2),
      -- Note: Values were all '1's. Translated to 'IN'.
  "IncidentCity" VARCHAR(32) NOT NULL CHECK(length(incidentcity) BETWEEN 1 AND 32),
  "IncidentCounty" VARCHAR(32) NOT NULL CHECK(length(incidentcounty) BETWEEN 1 AND 32),
      -- Note: Values were all '1's. Translated to 'MARION'.
  "IncidentZip" VARCHAR(10) CHECK((incidentzip GLOB '[0-9\-]*' AND length(incidentzip) IN (10, 5)) OR incidentzip IS NULL OR incidentzip IN ('4224', '46')),
      -- Note: there are two invalid values in the data: 4224 and 46
  "HomeAddressLine1" VARCHAR(48) CHECK(length(homeaddressline1) BETWEEN 1 AND 48 OR homeaddressline1 IS NULL),
  "HomeAddressLine2" VARCHAR(32) CHECK(length(homeaddressline1) BETWEEN 1 AND 48 OR homeaddressline1 IS NULL),
  "HomeZip"  VARCHAR(10) CHECK((homezip GLOB '[0-9\-]*' AND length(homezip) IN (10, 5)) OR homezip IS NULL OR homezip IN ('4224', '46')),
      -- Note: there is one invalid value in the data: 46
  "HomeCity" VARCHAR(32) NOT NULL CHECK(length(homecity) BETWEEN 1 AND 32),
  "HomeCounty" VARCHAR(32) CHECK(length(homecounty) BETWEEN 1 AND 32 OR homecounty IS NULL),
      -- Note: 44 records have no homecounty set.
  "HomeState" CHARACTER(2) NOT NULL CHECK(length(incidentstate) = 2),
  "ChiefComplaint_TEXT" VARCHAR(48) NOT NULL CHECK(length(chiefcomplaint_text) BETWEEN 1 AND 48),
  "SecondaryComplaintsAll_TEXT" VARCHAR(48) CHECK(length(secondarycomplaintsall_text) BETWEEN 1 AND 48 OR secondarycomplaintsall_text IS NULL),
  "FirstMOI_TEXT" VARCHAR(32) CHECK(length(firstmoi_text) BETWEEN 1 AND 32 OR firstmoi_text IS NULL),
  "FirstMOI_CATEGORIES" VARCHAR(2) NOT NULL CHECK(length(firstmoi_categories) BETWEEN 1 AND 2),
  "FirstMOI_Collapsed_CATEGORIES" VARCHAR(2) NOT NULL CHECK(length(firstmoi_collapsed_categories) BETWEEN 1 AND 2),
  "FirstMOIDetails_TEXT" VARCHAR(256) CHECK(length(firstmoidetails_text) BETWEEN 1 AND 256 OR firstmoidetails_text IS NULL),
  "ResponseOutcomeAll_TEXT" VARCHAR(64) CHECK(length(responseoutcomeall_text) BETWEEN 1 AND 64 OR responseoutcomeall_text IS NULL),
  "ResponseOutcomeAll_CATEGORIES" VARCHAR(2) NOT NULL CHECK(length(responseoutcomeall_categories) BETWEEN 1 AND 2),
  "ReceivingFacility_TEXT" VARCHAR(48) CHECK(length(receivingfacility_text) BETWEEN 1 AND 48 OR receivingfacility_text IS NULL),
  "OVERDOSE_DUMMY" BOOLEAN CHECK(overdose_dummy IN (0, 1)),
  "OVERDOSE_CC_MOI" BOOLEAN CHECK(overdose_cc_moi IN (0, 1)),
  "NALOXONE_DUMMY" BOOLEAN CHECK(naloxone_dummy IN (0, 1)),
  "LAST_NAME" VARCHAR(32) NOT NULL CHECK(length(last_name) BETWEEN 1 AND 32),
     -- Note: This has exactly the same values as last...
  "FIRST_NAME" VARCHAR(32) NOT NULL CHECK(length(first_name) BETWEEN 1 AND 32),
     -- Note: This has exactly the same values as first...
  "MIN_INCIDENT_DATE" DATE NOT NULL CHECK((typeof(min_incident_date) = 'text' AND length(dob) = 10)),
  "MAX_INCIDENT_DATE" DATE NOT NULL CHECK((typeof(max_incident_date) = 'text' AND length(dob) = 10)),
  FOREIGN KEY("CASE_NUMBER") REFERENCES deaths("CASE_NUMBER")
);
INSERT INTO ems_incidents
  SELECT
    CAST(ems_id AS INT),
    case_number,
    CAST(year AS INT),
    CAST(yob AS INT),
    patientid,
    last,
    first,
    date(dob),
    CASE middlename WHEN ' ' THEN NULL ELSE middlename END,
    CASE gender WHEN 'Female' THEN 'F' WHEN 'Male' THEN 'M' ELSE NULL END,
    race_ethnicity,
    CASE race_only
        WHEN '1' THEN 'White'
        WHEN '2' THEN 'Black'
        WHEN '3' THEN 'Hispanic'
        ELSE NULL
    END,
    date(pcrdatetime),
    NULLIF(CAST(incidentnumber AS INT), 0),
    incidentlocationtypeall_text,
    incidentlocationtypeall_categories,
    CASE incidentaddressline1_a WHEN ' ' THEN NULL ELSE incidentaddressline1_a END,
    CASE incidentaddressline2_a WHEN ' ' THEN NULL ELSE incidentaddressline2_a END,
    CASE incidentstate WHEN '1' THEN 'IN' ELSE UPPER(incidentstate) END,
    UPPER(incidentcity),
    CASE incidentcounty WHEN '1' THEN 'MARION' ELSE UPPER(incidentcounty) END,
    CASE incidentzip WHEN ' ' THEN NULL ELSE incidentzip END,
    CASE homeaddressline1 WHEN ' ' THEN NULL WHEN 'Unk' THEN 'Unknown' WHEN 'homeless' THEN 'Homeless' ELSE homeaddressline1 END,
    CASE homeaddressline2 WHEN ' ' THEN NULL ELSE homeaddressline2 END,
    CASE homezip WHEN ' ' THEN NULL ELSE homezip END,
    UPPER(homecity),
    CASE homecounty WHEN ' ' THEN NULL ELSE UPPER(homecounty) END,
    UPPER(homestate),
    chiefcomplaint_text,
    CASE secondarycomplaintsall_text WHEN ' ' THEN NULL ELSE secondarycomplaintsall_text END,
    CASE firstmoi_text WHEN ' ' THEN NULL ELSE firstmoi_text END,
    firstmoi_categories,
    firstmoi_collapsed_categories,
    CASE firstmoidetails_text WHEN ' ' THEN NULL ELSE firstmoidetails_text END,
    CASE responseoutcomeall_text WHEN ' ' THEN NULL ELSE responseoutcomeall_text END,
    CASE responseoutcomeall_categories WHEN ' ' THEN NULL ELSE responseoutcomeall_categories END,
    CASE receivingfacility_text WHEN ' ' THEN NULL ELSE receivingfacility_text END,
    CAST(NULLIF(overdose_dummy, '') AS BOOLEAN),
    CAST(NULLIF(overdose_cc_moi, '') AS BOOLEAN),
    CAST(NULLIF(naloxone_dummy, '') AS BOOLEAN),
    last_name,
    first_name,
    date(min_incident_date),
    date(max_incident_date)
  FROM Linked_EMS_Data_raw;
CREATE INDEX ems_incidents_fk ON ems_incidents("CASE_NUMBER");
