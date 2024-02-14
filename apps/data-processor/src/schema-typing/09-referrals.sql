-- Dr. Referrals (Long Datasets/od_referrals_long.csv) --
DROP TABLE IF EXISTS referrals;
CREATE TABLE referrals (
  "CASE_NUMBER" CHARACTER(6) NOT NULL CHECK(length(case_number) = 6 OR case_number = '172987a'),
      -- FIXME: case_number = 172987a is the only row that is not length 6 and is a duplicate of 172987 
  "DOD" DATE NOT NULL CHECK((typeof(dod) = 'text' AND length(dod) = 10)),
  "PHYS_TIME" DATE NOT NULL CHECK((typeof(phys_time) = 'text' AND length(phys_time) = 10)),
  "REFERRAL_NAME" VARCHAR(64) NOT NULL CHECK(length(referral_name) BETWEEN 2 AND 64),
  "STUDY_TEAM_CODE_USE" BOOLEAN NOT NULL CHECK(study_team_code_use IN (0, 1)),
  FOREIGN KEY("CASE_NUMBER") REFERENCES deaths("CASE_NUMBER")
);
INSERT INTO referrals
  SELECT case_number,
    date(dod),
    date(phys_time),
    referral_name,
    CASE study_team_code_use WHEN '' THEN false WHEN '1' THEN true ELSE NULL END
  FROM od_referrals_long_raw;
CREATE INDEX referrals_fk ON referrals("CASE_NUMBER");
