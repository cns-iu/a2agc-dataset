-- Aggregates counts by year, gender, and age group
-- Each age group is an integer [0, 7] where
-- 7 represents 0-9 years old
-- 6 represents 10-19 years old
-- etc.

SELECT
  printf('%d-%s-%d', YEAR, SEX, min(CAST((AGE / 10) AS INT), 7)) as key,
  YEAR as year,
  SEX as gender,
  AGE,
  min(CAST((AGE / 10) AS INT), 7) AS age_group,
  count(*) AS count
FROM deaths
GROUP BY year, gender, age_group
ORDER BY year, gender, age_group ASC;
