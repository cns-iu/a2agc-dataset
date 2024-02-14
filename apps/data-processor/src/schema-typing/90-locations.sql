DROP TABLE IF EXISTS locations;
CREATE TABLE locations (
  address VARCHAR(96),
  city VARCHAR(64),
  county VARCHAR(32),
  zip VARCHAR(10),
  state CHARACTER(2),
  normalized VARCHAR(400), -- Normalized address provided by geocoder
  latitude REAL,
  longitude REAL,
  UNIQUE (address, city, county, zip, state) ON CONFLICT IGNORE
);

INSERT INTO locations
  SELECT
    CASE home_address
      WHEN 'Unknown' THEN NULL
      WHEN 'Homeless' THEN NULL
      ELSE home_address
    END,
    CASE home_city
      WHEN 'Unknown' THEN NULL
      WHEN 'Homeless' THEN NULL
      ELSE home_city
    END,
    NULL,
    CASE home_zip
      WHEN 'Unknown' THEN NULL
      WHEN 'Homeless' THEN NULL
      ELSE home_zip
    END,
    CASE home_state
      WHEN 'Unknown' THEN NULL
      ELSE home_state
    END,
    NULL,
    NULL,
    NULL
  FROM deaths;

INSERT INTO locations
  SELECT
    CASE injury_address
      WHEN 'Unknown' THEN NULL
      WHEN 'Homeless' THEN NULL
      ELSE injury_address
    END,
    CASE injury_city
      WHEN 'Unknown' THEN NULL
      WHEN 'Homeless' THEN NULL
      ELSE injury_city
    END,
    NULL,
    CASE injury_zip
      WHEN 'Unknown' THEN NULL
      WHEN 'Homeless' THEN NULL
      ELSE injury_zip
    END,
    NULL,
    NULL,
    NULL,
    NULL
  FROM deaths;

INSERT INTO locations
  SELECT
    TRIM(PRINTF('%s,%s', IncidentAddressLine1_A, IncidentAddressLine2_A), ','),
    IncidentCity,
    IncidentCounty,
    IncidentZip,
    IncidentState,
    NULL,
    NULL,
    NULL
  FROM ems_incidents;

INSERT INTO locations
  SELECT
    TRIM(PRINTF('%s,%s', HomeAddressLine1, HomeAddressLine2), ','),
    HomeCity,
    HomeCounty,
    HomeZip,
    HomeState,
    NULL,
    NULL,
    NULL
  FROM ems_incidents;

-- Ensure no duplicates
DELETE FROM locations
  WHERE _rowid_ NOT IN (
    SELECT MIN(_rowid_) FROM locations
      GROUP BY address, city, county, zip, state
  );
