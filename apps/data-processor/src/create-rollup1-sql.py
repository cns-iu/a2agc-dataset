import pandas

XLS='raw-data/original/box-health/Data Dictionaries/Overdose_data_dictionary.xlsx'
SQL='src/schema-typing/10-rollup1.sql'
SKIP_UNTIL="NOTES"
BAD_COLS=set(['JAIL_DATA'])

SQL_TEMPLATE = """-- Summary data for analysts, extract 1 (Marion_OD_Dataset-4_22_2019.csv) --
DROP TABLE IF EXISTS rollup1;
CREATE TABLE rollup1 (
  "CASE_NUMBER" CHARACTER(6) NOT NULL CHECK(length(case_number) = 6 OR case_number = '172987a'),
      -- FIXME: case_number = 172987a is the only row that is not length 6 and is a duplicate of 172987
{0},
  FOREIGN KEY("CASE_NUMBER") REFERENCES deaths("CASE_NUMBER")
);
INSERT INTO rollup1
  SELECT case_number,
{1}
  FROM od_deaths_raw;
CREATE INDEX rollup1_fk ON rollup1("CASE_NUMBER");
"""

def col_lower(c):
  return col.lower() if not (c[0].isdigit() or '-' in c) else '"{0}"'.format(c)

coldefs = []
selects = []

into_rollup1 = False
data = pandas.read_excel(XLS)
for (col, var_type, description) in zip(data['Column Name'],data['Variable Type'],data['Description']):
  if col == SKIP_UNTIL:
    into_rollup1 = True
  elif col not in BAD_COLS and into_rollup1:
    # Uncomment below for xml used to update schemaspy.meta.xml
    #print('            <column name="{0}" comments="{1}"/>'.format(col, description.replace('"', "'")))
    lowcol = col_lower(col)
    if var_type == 'logical':
      coldefs.append('  "{0}" BOOLEAN NOT NULL CHECK({1} IN (0, 1))'.format(col, lowcol))
      selects.append("  CASE {0} WHEN 'FALSE' THEN false WHEN '0' THEN false WHEN 'TRUE' THEN true WHEN '1' THEN true ELSE NULL END".format(lowcol))
    elif var_type == 'numeric':
      coldefs.append('  "{0}" INT NOT NULL CHECK(typeof({1}) = \'integer\')'.format(col, lowcol))
      selects.append('  CAST({0} AS INT)'.format(lowcol))
    elif var_type == 'Date':
      coldefs.append('  "{0}" DATE CHECK((typeof({1}) = \'text\' AND length({1}) = 10) OR {1} IS NULL)'.format(col, lowcol))
      selects.append('  CASE {0} WHEN \'\' THEN NULL ELSE date({0}) END'.format(lowcol))
    else:
      coldefs.append('  "{0}" TEXT'.format(col))
      selects.append('  {0}'.format(lowcol))

with open(SQL, 'w') as out:
  out.write(SQL_TEMPLATE.format(',\n'.join(coldefs), ',\n'.join(selects)))
