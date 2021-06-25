-- Summary data for analysts, weekly incarcerations (Marion_OD_Jail_Weekly--06252019.csv) --
DROP TABLE IF EXISTS incarcerations_weekly;
CREATE TABLE incarcerations_weekly (
  "CASE_NUMBER" CHARACTER(6) NOT NULL CHECK(length(case_number) = 6 OR case_number = '172987a'),
      -- FIXME: case_number = 172987a is the only row that is not length 6 and is a duplicate of 172987 
  "ANY_DAYS_BOOKED_1_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_1_week IN (0, 1)),
  "ANY_DAYS_BOOKED_2_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_2_week IN (0, 1)),
  "ANY_DAYS_BOOKED_3_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_3_week IN (0, 1)),
  "ANY_DAYS_BOOKED_4_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_4_week IN (0, 1)),
  "ANY_DAYS_BOOKED_5_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_5_week IN (0, 1)),
  "ANY_DAYS_BOOKED_6_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_6_week IN (0, 1)),
  "ANY_DAYS_BOOKED_7_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_7_week IN (0, 1)),
  "ANY_DAYS_BOOKED_8_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_8_week IN (0, 1)),
  "ANY_DAYS_BOOKED_9_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_9_week IN (0, 1)),
  "ANY_DAYS_BOOKED_10_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_10_week IN (0, 1)),
  "ANY_DAYS_BOOKED_11_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_11_week IN (0, 1)),
  "ANY_DAYS_BOOKED_12_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_12_week IN (0, 1)),
  "ANY_DAYS_BOOKED_13_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_13_week IN (0, 1)),
  "ANY_DAYS_BOOKED_14_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_14_week IN (0, 1)),
  "ANY_DAYS_BOOKED_15_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_15_week IN (0, 1)),
  "ANY_DAYS_BOOKED_16_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_16_week IN (0, 1)),
  "ANY_DAYS_BOOKED_17_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_17_week IN (0, 1)),
  "ANY_DAYS_BOOKED_18_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_18_week IN (0, 1)),
  "ANY_DAYS_BOOKED_19_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_19_week IN (0, 1)),
  "ANY_DAYS_BOOKED_20_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_20_week IN (0, 1)),
  "ANY_DAYS_BOOKED_21_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_21_week IN (0, 1)),
  "ANY_DAYS_BOOKED_22_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_22_week IN (0, 1)),
  "ANY_DAYS_BOOKED_23_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_23_week IN (0, 1)),
  "ANY_DAYS_BOOKED_24_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_24_week IN (0, 1)),
  "ANY_DAYS_BOOKED_25_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_25_week IN (0, 1)),
  "ANY_DAYS_BOOKED_26_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_26_week IN (0, 1)),
  "ANY_DAYS_BOOKED_27_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_27_week IN (0, 1)),
  "ANY_DAYS_BOOKED_28_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_28_week IN (0, 1)),
  "ANY_DAYS_BOOKED_29_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_29_week IN (0, 1)),
  "ANY_DAYS_BOOKED_30_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_30_week IN (0, 1)),
  "ANY_DAYS_BOOKED_31_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_31_week IN (0, 1)),
  "ANY_DAYS_BOOKED_32_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_32_week IN (0, 1)),
  "ANY_DAYS_BOOKED_33_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_33_week IN (0, 1)),
  "ANY_DAYS_BOOKED_34_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_34_week IN (0, 1)),
  "ANY_DAYS_BOOKED_35_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_35_week IN (0, 1)),
  "ANY_DAYS_BOOKED_36_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_36_week IN (0, 1)),
  "ANY_DAYS_BOOKED_37_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_37_week IN (0, 1)),
  "ANY_DAYS_BOOKED_38_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_38_week IN (0, 1)),
  "ANY_DAYS_BOOKED_39_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_39_week IN (0, 1)),
  "ANY_DAYS_BOOKED_40_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_40_week IN (0, 1)),
  "ANY_DAYS_BOOKED_41_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_41_week IN (0, 1)),
  "ANY_DAYS_BOOKED_42_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_42_week IN (0, 1)),
  "ANY_DAYS_BOOKED_43_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_43_week IN (0, 1)),
  "ANY_DAYS_BOOKED_44_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_44_week IN (0, 1)),
  "ANY_DAYS_BOOKED_45_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_45_week IN (0, 1)),
  "ANY_DAYS_BOOKED_46_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_46_week IN (0, 1)),
  "ANY_DAYS_BOOKED_47_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_47_week IN (0, 1)),
  "ANY_DAYS_BOOKED_48_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_48_week IN (0, 1)),
  "ANY_DAYS_BOOKED_49_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_49_week IN (0, 1)),
  "ANY_DAYS_BOOKED_50_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_50_week IN (0, 1)),
  "ANY_DAYS_BOOKED_51_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_51_week IN (0, 1)),
  "ANY_DAYS_BOOKED_52_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_52_week IN (0, 1)),
  "ANY_DAYS_BOOKED_53_WEEK" BOOLEAN NOT NULL CHECK(any_days_booked_53_week IN (0, 1)),
  FOREIGN KEY("CASE_NUMBER") REFERENCES deaths("CASE_NUMBER")
);
INSERT INTO incarcerations_weekly
  SELECT case_number,
    CASE any_days_booked_1_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_2_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_3_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_4_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_5_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_6_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_7_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_8_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_9_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_10_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_11_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_12_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_13_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_14_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_15_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_16_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_17_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_18_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_19_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_20_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_21_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_22_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_23_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_24_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_25_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_26_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_27_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_28_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_29_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_30_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_31_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_32_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_33_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_34_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_35_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_36_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_37_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_38_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_39_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_40_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_41_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_42_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_43_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_44_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_45_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_46_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_47_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_48_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_49_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_50_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_51_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_52_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END,
    CASE any_days_booked_53_week WHEN '0' THEN false WHEN '1' THEN true ELSE NULL END
  FROM od_incarcerations_weekly_raw;
CREATE INDEX incarcerations_weekly_fk ON incarcerations_weekly("CASE_NUMBER");