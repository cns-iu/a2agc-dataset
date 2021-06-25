-- Opioid Deaths (Marion_OD_Dataset-4_22_2019.csv) --
PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS deaths;
DROP INDEX IF EXISTS deaths_pk;

PRAGMA foreign_keys = ON;

CREATE TABLE deaths (
  "CASE_NUMBER" CHARACTER(6) CHECK(length(case_number) = 6 OR case_number = '172987a') PRIMARY KEY,
      -- FIXME: case_number = 172987a is the only row that is not length 6 and is a duplicate of 172987
  "YEAR" INT CHECK(typeof(year) = 'integer'),
  "LAST_NAME" VARCHAR(32) CHECK(length(last_name) BETWEEN 1 AND 32),
  "FIRST_NAME" VARCHAR(32) CHECK(length(first_name) BETWEEN 1 AND 32),
  "SSN" VARCHAR(11) CHECK(ssn IS NULL OR length(ssn) = 11),
  "SEX" CHARACTER CHECK(sex = 'M' OR sex = 'F'),
  "RACE" CHARACTER CHECK(race IN (NULL, 'White', 'Black', 'Hispanic', 'Other')),
  "DOB" DATE CHECK((typeof(dob) = 'text' AND length(dob) = 10) OR dob IS NULL),
      -- FIXME: 2 cases (121121 and 172311) do not have a DOB.
  "DOD" DATE CHECK(typeof(dod) = 'text' AND length(dod) = 10),
  "AGE" INT CHECK(typeof(age) = 'integer' AND age BETWEEN 0 AND 130),
  "MILITARY" BOOLEAN CHECK(military IN (NULL, 0, 1)),
  "EMPLOYMENT" CHARACTER CHECK(employment IN (NULL, 'Employed', 'Unemployed', 'Student', 'Disabled', 'Retired')),
  "EDUCATION" CHARACTER CHECK(education IN (NULL, 'Under 8th grade', 'High school - Not finished',
                                            'Graduated high school', 'Some college - No degree',
                                            'Technical/vocational degree', 'College degree',
                                            'Post graduation degree (Masters, PHD, MD, etc.)')),
  "MARITAL_STATUS" CHARACTER CHECK(marital_status IN (NULL, 'Never married', 'Married', 'Separated', 'Widowed', 'Divorced')),
  "HOME_ADDRESS" VARCHAR(96) NOT NULL CHECK(length(home_address) BETWEEN 1 AND 96 OR home_address IN ('Unknown', 'Homeless')),
  "HOME_CITY" VARCHAR(64) NOT NULL CHECK(length(home_city) BETWEEN 1 AND 64 OR home_city IN ('Unknown', 'Homeless')),
  "HOME_ZIP" VARCHAR(8) NOT NULL CHECK(length(home_zip) = 5 OR home_zip IN ('Unknown', 'Homeless', '8031')),
      -- FIXME: There is a bad zip: 8031
  "HOME_STATE" VARCHAR(7) NOT NULL CHECK(length(home_state) = 2 OR home_state = 'Unknown'),
  "INJURY_ADDRESS" VARCHAR(96) NOT NULL CHECK(length(injury_address) BETWEEN 1 AND 96),
  "INJURY_CITY" VARCHAR(64) NOT NULL CHECK(length(injury_city) BETWEEN 1 AND 64 OR home_city = 'Unknown'),
      -- FIXME: There are zero length cities that can be filled in. Setting them to 'Unknown' currently.
  "INJURY_ZIP" VARCHAR(7) NOT NULL CHECK(length(injury_zip) = 5 OR injury_zip = 'Unknown'),
  "PLACE_OF_DEATH" CHARACTER CHECK(place_of_death IN (NULL, 'Residence', 'Other Residence', 'Hospital-Inpatient', 'ER-Outpatient')),
  "SPECIFIC_PLACE_OF_DEATH" VARCHAR(96) NOT NULL CHECK(length(specific_place_of_death) BETWEEN 1 AND 96),
      -- FIXME: Bad unicode character in 'Friend's Residence�'
  "PLACE_OF_INJURY" CHARACTER CHECK(place_of_injury IN (NULL, 'Residence', 'Other Residence', 'Workplace')),
  "SPECIFIC_PLACE_OF_INJURY" VARCHAR(196) NOT NULL CHECK(length(specific_place_of_injury) BETWEEN 1 AND 196),
  "DESCRIBE_INJURY" VARCHAR(512) NOT NULL CHECK(length(describe_injury) BETWEEN 1 AND 512 OR describe_injury = 'Unknown'),
      -- FIXME: Bad unicode character in 'Decedent crashed his SUV on an interstate�'
      -- NOTE: Converted '' and 'NA' to 'Unknown'
  "MEDICAL_HISTORY" VARCHAR(3072) NOT NULL CHECK(length(medical_history) < 3072),
  "DRUG_PARAPHERNALIA" BOOLEAN CHECK(drug_paraphernalia IN (NULL, 0, 1)),
  "NEEDLES_OR_HEROIN" BOOLEAN CHECK(needles_or_heroin IN (NULL, 0, 1)),
  "WITNESS_MENTION_DRUGS" BOOLEAN CHECK(witness_mention_drugs IN (NULL, 0, 1)),
  "CAUSE_OF_DEATH" VARCHAR(256) NOT NULL CHECK(length(cause_of_death) BETWEEN 1 AND 256),
  "PRIMARY_TOX_LAB" BOOLEAN CHECK(primary_tox_lab IN (NULL, 0, 1)),
  "ALCOHOLS" BOOLEAN CHECK(alcohols IN (NULL, 0, 1)),
  "ETHANOL" BOOLEAN CHECK(ethanol IN (NULL, 0, 1)),
  "ACETONE" BOOLEAN CHECK(acetone IN (NULL, 0, 1)),
  "ISOPROPANOL" BOOLEAN CHECK(isopropanol IN (NULL, 0, 1)),
  "METHANOL" BOOLEAN CHECK(methanol IN (NULL, 0, 1)),
  "AMPHETAMINES" BOOLEAN CHECK(amphetamines IN (NULL, 0, 1)),
  "AMPHETAMINE" BOOLEAN CHECK(amphetamine IN (NULL, 0, 1)),
  "METHAMPHETAMINE" BOOLEAN CHECK(methamphetamine IN (NULL, 0, 1)),
  "EPHEDRINE" BOOLEAN CHECK(ephedrine IN (NULL, 0, 1)),
  "MDMA" BOOLEAN CHECK(mdma IN (NULL, 0, 1)),
  "MDA" BOOLEAN CHECK(mda IN (NULL, 0, 1)),
  "PHENYLPROPANOLAMINE" BOOLEAN CHECK(phenylpropanolamine IN (NULL, 0, 1)),
  "PHENTERMINE" BOOLEAN CHECK(phentermine IN (NULL, 0, 1)),
  "ANALGESICS" BOOLEAN CHECK(analgesics IN (NULL, 0, 1)),
  "ACETAMINOPHEN" BOOLEAN CHECK(acetaminophen IN (NULL, 0, 1)),
  "SALICYLATES" BOOLEAN CHECK(salicylates IN (NULL, 0, 1)),
  "NAPROXEN" BOOLEAN CHECK(naproxen IN (NULL, 0, 1)),
  "ANTIBIOTICS" BOOLEAN CHECK(antibiotics IN (NULL, 0, 1)),
  "AZITHROMYCIN" BOOLEAN CHECK(azithromycin IN (NULL, 0, 1)),
  "PIPERACILLIN" BOOLEAN CHECK(piperacillin IN (NULL, 0, 1)),
  "LEVOFLOXACIN" BOOLEAN CHECK(levofloxacin IN (NULL, 0, 1)),
  "ANTICONVULSANTS" BOOLEAN CHECK(anticonvulsants IN (NULL, 0, 1)),
  "GABAPENTIN" BOOLEAN CHECK(gabapentin IN (NULL, 0, 1)),
  "OXCARBAZEPINE" BOOLEAN CHECK(oxcarbazepine IN (NULL, 0, 1)),
  "TOPIRAMATE" BOOLEAN CHECK(topiramate IN (NULL, 0, 1)),
  "LAMOTRIGINE" BOOLEAN CHECK(lamotrigine IN (NULL, 0, 1)),
  "LEVETIRACETAM" BOOLEAN CHECK(levetiracetam IN (NULL, 0, 1)),
  "PREGABALIN" BOOLEAN CHECK(pregabalin IN (NULL, 0, 1)),
  "ZONISAMIDE" BOOLEAN CHECK(zonisamide IN (NULL, 0, 1)),
  "VALPROICACID" BOOLEAN CHECK(valproicacid IN (NULL, 0, 1)),
  "ANTIDEPRESSANTS" BOOLEAN CHECK(antidepressants IN (NULL, 0, 1)),
  "PAROXETINE" BOOLEAN CHECK(paroxetine IN (NULL, 0, 1)),
  "FLUOXETINE" BOOLEAN CHECK(fluoxetine IN (NULL, 0, 1)),
  "NORFLUOXETINE" BOOLEAN CHECK(norfluoxetine IN (NULL, 0, 1)),
  "MIRTAZAPINE" BOOLEAN CHECK(mirtazapine IN (NULL, 0, 1)),
  "CITALOPRAM" BOOLEAN CHECK(citalopram IN (NULL, 0, 1)),
  "TRAZODONE" BOOLEAN CHECK(trazodone IN (NULL, 0, 1)),
  "CHLOROPHENYLPIPERAZINE" BOOLEAN CHECK(chlorophenylpiperazine IN (NULL, 0, 1)),
  "DOXEPIN" BOOLEAN CHECK(doxepin IN (NULL, 0, 1)),
  "NORDOXEPIN" BOOLEAN CHECK(nordoxepin IN (NULL, 0, 1)),
  "FLUVOXAMINE" BOOLEAN CHECK(fluvoxamine IN (NULL, 0, 1)),
  "SERTRALINE" BOOLEAN CHECK(sertraline IN (NULL, 0, 1)),
  "NORSERTRALINE" BOOLEAN CHECK(norsertraline IN (NULL, 0, 1)),
  "DESMETHYLSERTRALINE" BOOLEAN CHECK(desmethylsertraline IN (NULL, 0, 1)),
  "AMITRIPTYLINE" BOOLEAN CHECK(amitriptyline IN (NULL, 0, 1)),
  "NORTRIPTYLINE" BOOLEAN CHECK(nortriptyline IN (NULL, 0, 1)),
  "DULOXETINE" BOOLEAN CHECK(duloxetine IN (NULL, 0, 1)),
  "NORVENLAFAXINE" BOOLEAN CHECK(norvenlafaxine IN (NULL, 0, 1)),
  "BUPROPION" BOOLEAN CHECK(bupropion IN (NULL, 0, 1)),
  "HYDROXYBUPRIOPION" BOOLEAN CHECK(hydroxybupriopion IN (NULL, 0, 1)),
  "VENLAFAXINE" BOOLEAN CHECK(venlafaxine IN (NULL, 0, 1)),
  "ODESMETHYLVENLAFAXINE" BOOLEAN CHECK(odesmethylvenlafaxine IN (NULL, 0, 1)),
  "MCPP" BOOLEAN CHECK(mcpp IN (NULL, 0, 1)),
  "DESMETHYLDOXEPIN" BOOLEAN CHECK(desmethyldoxepin IN (NULL, 0, 1)),
  "ANTIHISTAMINES" BOOLEAN CHECK(antihistamines IN (NULL, 0, 1)),
  "HYDROXYZINE" BOOLEAN CHECK(hydroxyzine IN (NULL, 0, 1)),
  "DIPHENHYDRAMINE" BOOLEAN CHECK(diphenhydramine IN (NULL, 0, 1)),
  "DOXYLAMINE" BOOLEAN CHECK(doxylamine IN (NULL, 0, 1)),
  "CHLOROPHENIRAMINE" BOOLEAN CHECK(chloropheniramine IN (NULL, 0, 1)),
  "GUAIFENESIN" BOOLEAN CHECK(guaifenesin IN (NULL, 0, 1)),
  "ANTIPSYCOTICS" BOOLEAN CHECK(antipsycotics IN (NULL, 0, 1)),
  "CLOZAPINE" BOOLEAN CHECK(clozapine IN (NULL, 0, 1)),
  "NORCLOZAPINE" BOOLEAN CHECK(norclozapine IN (NULL, 0, 1)),
  "QUETIAPINE" BOOLEAN CHECK(quetiapine IN (NULL, 0, 1)),
  "AMLODIPINE" BOOLEAN CHECK(amlodipine IN (NULL, 0, 1)),
  "ARIPIPRAZOLE" BOOLEAN CHECK(aripiprazole IN (NULL, 0, 1)),
  "OLANZAPINE" BOOLEAN CHECK(olanzapine IN (NULL, 0, 1)),
  "BUSPIRONE" BOOLEAN CHECK(buspirone IN (NULL, 0, 1)),
  "BENZATROPINE" BOOLEAN CHECK(benzatropine IN (NULL, 0, 1)),
  "RISPERIDONE" BOOLEAN CHECK(risperidone IN (NULL, 0, 1)),
  "9_HYDROXYRISPERIDONE" BOOLEAN CHECK("9_HYDROXYRISPERIDONE" IN (NULL, 0, 1)),
  "BARBITUATES" BOOLEAN CHECK(barbituates IN (NULL, 0, 1)),
  "PHENOBARBITAL" BOOLEAN CHECK(phenobarbital IN (NULL, 0, 1)),
  "BUTALBITAL" BOOLEAN CHECK(butalbital IN (NULL, 0, 1)),
  "BENZODIAZEPINE" BOOLEAN CHECK(benzodiazepine IN (NULL, 0, 1)),
  "LORAZEPAM" BOOLEAN CHECK(lorazepam IN (NULL, 0, 1)),
  "CLONAZEPAM" BOOLEAN CHECK(clonazepam IN (NULL, 0, 1)),
  "NORDIAZAPAM" BOOLEAN CHECK(nordiazapam IN (NULL, 0, 1)),
  "DIAZEPAM" BOOLEAN CHECK(diazepam IN (NULL, 0, 1)),
  "ALPRAZOLAM" BOOLEAN CHECK(alprazolam IN (NULL, 0, 1)),
  "7AMINOCLONAZEPAM" BOOLEAN CHECK("7AMINOCLONAZEPAM" IN (NULL, 0, 1)),
  "AOHALPRAZOLAM" BOOLEAN CHECK(aohalprazolam IN (NULL, 0, 1)),
  "TEMAZEPAM" BOOLEAN CHECK(temazepam IN (NULL, 0, 1)),
  "OXAZEPAM" BOOLEAN CHECK(oxazepam IN (NULL, 0, 1)),
  "CHLORDIAZEPOXIDE" BOOLEAN CHECK(chlordiazepoxide IN (NULL, 0, 1)),
  "ALPHAHYDROXYALPRAZOLAM" BOOLEAN CHECK(alphahydroxyalprazolam IN (NULL, 0, 1)),
  "DEMOXEPAM" BOOLEAN CHECK(demoxepam IN (NULL, 0, 1)),
  "MIDAZOLAM" BOOLEAN CHECK(midazolam IN (NULL, 0, 1)),
  "FLUBRAMAZOLAM" BOOLEAN CHECK(flubramazolam IN (NULL, 0, 1)),
  "PHENAZEPAM" BOOLEAN CHECK(phenazepam IN (NULL, 0, 1)),
  "DELORAZEPAM" BOOLEAN CHECK(delorazepam IN (NULL, 0, 1)),
  "DICLAZEPAM" BOOLEAN CHECK(diclazepam IN (NULL, 0, 1)),
  "CARDIOVASCULAR" BOOLEAN CHECK(cardiovascular IN (NULL, 0, 1)),
  "VERAPAMIL" BOOLEAN CHECK(verapamil IN (NULL, 0, 1)),
  "METOPROLOL" BOOLEAN CHECK(metoprolol IN (NULL, 0, 1)),
  "DILTIAZEM" BOOLEAN CHECK(diltiazem IN (NULL, 0, 1)),
  "PROPRANOLOL" BOOLEAN CHECK(propranolol IN (NULL, 0, 1)),
  "HYDROCHLOROTHIAZIDE" BOOLEAN CHECK(hydrochlorothiazide IN (NULL, 0, 1)),
  "LIDOCAINE" BOOLEAN CHECK(lidocaine IN (NULL, 0, 1)),
  "CLONIDINE" BOOLEAN CHECK(clonidine IN (NULL, 0, 1)),
  "GASTROINTESTIONALS" BOOLEAN CHECK(gastrointestionals IN (NULL, 0, 1)),
  "PROMETHAZINE" BOOLEAN CHECK(promethazine IN (NULL, 0, 1)),
  "DICYCLOMINE" BOOLEAN CHECK(dicyclomine IN (NULL, 0, 1)),
  "LOPERAMIDE" BOOLEAN CHECK(loperamide IN (NULL, 0, 1)),
  "DESMETHYLLOPERAMIDE" BOOLEAN CHECK(desmethylloperamide IN (NULL, 0, 1)),
  "ILLICITS" BOOLEAN CHECK(illicits IN (NULL, 0, 1)),
  "6_MAM" BOOLEAN CHECK("6_MAM" IN (NULL, 0, 1)),
  "HEROIN_FROM_COMBO" BOOLEAN CHECK(heroin_from_combo IN (NULL, 0, 1)),
  "COCAINE" BOOLEAN CHECK(cocaine IN (NULL, 0, 1)),
  "BENZOYLECGONINE" BOOLEAN CHECK(benzoylecgonine IN (NULL, 0, 1)),
  "COCAETHYLENE" BOOLEAN CHECK(cocaethylene IN (NULL, 0, 1)),
  "PCP" BOOLEAN CHECK(pcp IN (NULL, 0, 1)),
  "THC" BOOLEAN CHECK(thc IN (NULL, 0, 1)),
  "THC_COOH" BOOLEAN CHECK(thc_cooh IN (NULL, 0, 1)),
  "CARBOXY_THC" BOOLEAN CHECK(carboxy_thc IN (NULL, 0, 1)),
  "DELTA_9_THC" BOOLEAN CHECK(delta_9_thc IN (NULL, 0, 1)),
  "DELTA_9_CARBOXY_THC" BOOLEAN CHECK(delta_9_carboxy_thc IN (NULL, 0, 1)),
  "11_HYDROXY_DELTA_9_THC" BOOLEAN CHECK("11_HYDROXY_DELTA_9_THC" IN (NULL, 0, 1)),
  "5F_ADB_THC_SYNTHETIC" BOOLEAN CHECK("5F_ADB_THC_SYNTHETIC" IN (NULL, 0, 1)),
  "CANNIBIDIOL_AGGREGATE" BOOLEAN CHECK(cannibidiol_aggregate IN (NULL, 0, 1)),
  "OPIOIDS" BOOLEAN CHECK(opioids IN (NULL, 0, 1)),
  "MORPHINE" BOOLEAN CHECK(morphine IN (NULL, 0, 1)),
  "CODEINE" BOOLEAN CHECK(codeine IN (NULL, 0, 1)),
  "FENTANYL" BOOLEAN CHECK(fentanyl IN (NULL, 0, 1)),
  "NORFENTANYL" BOOLEAN CHECK(norfentanyl IN (NULL, 0, 1)),
  "ACETYLFETANYL" BOOLEAN CHECK(acetylfetanyl IN (NULL, 0, 1)),
  "ACRYLFENTANYL" BOOLEAN CHECK(acrylfentanyl IN (NULL, 0, 1)),
  "PARA_FLUOROBUTYRYL_FENTANYL" BOOLEAN CHECK(para_fluorobutyryl_fentanyl IN (NULL, 0, 1)),
  "FENTANYL_4_ANPP" BOOLEAN CHECK(fentanyl_4_anpp IN (NULL, 0, 1)),
  "METHOXYACETYL_FENTANYL" BOOLEAN CHECK(methoxyacetyl_fentanyl IN (NULL, 0, 1)),
  "FURANYL_FETANYL" BOOLEAN CHECK(furanyl_fetanyl IN (NULL, 0, 1)),
  "CARFENTANIL" BOOLEAN CHECK(carfentanil IN (NULL, 0, 1)),
  "OXYCODONE" BOOLEAN CHECK(oxycodone IN (NULL, 0, 1)),
  "HYDROCODONE" BOOLEAN CHECK(hydrocodone IN (NULL, 0, 1)),
  "OXYMORPHONE" BOOLEAN CHECK(oxymorphone IN (NULL, 0, 1)),
  "HYDROMORPHONE" BOOLEAN CHECK(hydromorphone IN (NULL, 0, 1)),
  "DIHYDROCODEINE" BOOLEAN CHECK(dihydrocodeine IN (NULL, 0, 1)),
  "OPIATES" BOOLEAN CHECK(opiates IN (NULL, 0, 1)),
  "BUPRENORPHINE" BOOLEAN CHECK(buprenorphine IN (NULL, 0, 1)),
  "NORBUPRENORPHINE" BOOLEAN CHECK(norbuprenorphine IN (NULL, 0, 1)),
  "NORMEPERIDINE" BOOLEAN CHECK(normeperidine IN (NULL, 0, 1)),
  "U477" BOOLEAN CHECK(u477 IN (NULL, 0, 1)),
  "TRAMADOL" BOOLEAN CHECK(tramadol IN (NULL, 0, 1)),
  "NORTRAMADOL" BOOLEAN CHECK(nortramadol IN (NULL, 0, 1)),
  "O-DESMETHYLTRAMADOL" BOOLEAN CHECK("O-DESMETHYLTRAMADOL" IN (NULL, 0, 1)),
  "TRAMADOL_AGGREGATE" BOOLEAN CHECK(tramadol_aggregate IN (NULL, 0, 1)),
  "METHADONE" BOOLEAN CHECK(methadone IN (NULL, 0, 1)),
  "EDDP" BOOLEAN CHECK(eddp IN (NULL, 0, 1)),
  "MITRAGYNINE" BOOLEAN CHECK(mitragynine IN (NULL, 0, 1)),
  "NORCODEINE" BOOLEAN CHECK(norcodeine IN (NULL, 0, 1)),
  "OPIOID_ANTAGONIST" BOOLEAN CHECK(opioid_antagonist IN (NULL, 0, 1)),
  "NALOXONE" BOOLEAN CHECK(naloxone IN (NULL, 0, 1)),
  "MISCELLANEOUS" BOOLEAN CHECK(miscellaneous IN (NULL, 0, 1)),
  "HYDROXYCHLOROQUINE" BOOLEAN CHECK(hydroxychloroquine IN (NULL, 0, 1)),
  "ATENOLOL" BOOLEAN CHECK(atenolol IN (NULL, 0, 1)),
  "NARCOTICS" BOOLEAN CHECK(narcotics IN (NULL, 0, 1)),
  "GLUCOSE" BOOLEAN CHECK(glucose IN (NULL, 0, 1)),
  "CARBOXYHEMOGLOBIN" BOOLEAN CHECK(carboxyhemoglobin IN (NULL, 0, 1)),
  "PSYCHOACTIVESUBSTANCES" BOOLEAN CHECK(psychoactivesubstances IN (NULL, 0, 1)),
  "DIFLUOROETHANE" BOOLEAN CHECK(difluoroethane IN (NULL, 0, 1)),
  "AMIODARONE" BOOLEAN CHECK(amiodarone IN (NULL, 0, 1)),
  "YOHIMBINE" BOOLEAN CHECK(yohimbine IN (NULL, 0, 1)),
  "GILIPIZIDE" BOOLEAN CHECK(gilipizide IN (NULL, 0, 1)),
  "SILDENAFIL" BOOLEAN CHECK(sildenafil IN (NULL, 0, 1)),
  "QUININE" BOOLEAN CHECK(quinine IN (NULL, 0, 1)),
  "LEVAMISOLE" BOOLEAN CHECK(levamisole IN (NULL, 0, 1)),
  "N_DESMETHYLSILDENAFIL" BOOLEAN CHECK(n_desmethylsildenafil IN (NULL, 0, 1)),
  "6_BETA_NALTREXOL" BOOLEAN CHECK("6_BETA_NALTREXOL" IN (NULL, 0, 1)),
  "MUSCLE_RELAXANTS" BOOLEAN CHECK(muscle_relaxants IN (NULL, 0, 1)),
  "METHOCARBAMOL" BOOLEAN CHECK(methocarbamol IN (NULL, 0, 1)),
  "TIZANADINE" BOOLEAN CHECK(tizanadine IN (NULL, 0, 1)),
  "CYCLOBENZAPRINE" BOOLEAN CHECK(cyclobenzaprine IN (NULL, 0, 1)),
  "CARISOPRODOL" BOOLEAN CHECK(carisoprodol IN (NULL, 0, 1)),
  "MEPROBAMATE" BOOLEAN CHECK(meprobamate IN (NULL, 0, 1)),
  "ORPHENADRINE" BOOLEAN CHECK(orphenadrine IN (NULL, 0, 1)),
  "NEUROLOGICALS" BOOLEAN CHECK(neurologicals IN (NULL, 0, 1)),
  "BENZTROPINE" BOOLEAN CHECK(benztropine IN (NULL, 0, 1)),
  "OTC_COLD_REMEDIES" BOOLEAN CHECK(otc_cold_remedies IN (NULL, 0, 1)),
  "DEXTROMETHORPHAN" BOOLEAN CHECK(dextromethorphan IN (NULL, 0, 1)),
  "PSEUDOEPHEDRINE" BOOLEAN CHECK(pseudoephedrine IN (NULL, 0, 1)),
  "NORPSEUDOEPHEDRINE" BOOLEAN CHECK(norpseudoephedrine IN (NULL, 0, 1)),
  "SEDATIVES_HYPNOTICS" BOOLEAN CHECK(sedatives_hypnotics IN (NULL, 0, 1)),
  "ESZOPICLONE" BOOLEAN CHECK(eszopiclone IN (NULL, 0, 1)),
  "ZOLPIDEM" BOOLEAN CHECK(zolpidem IN (NULL, 0, 1)),
  "STIMULANTS" BOOLEAN CHECK(stimulants IN (NULL, 0, 1)),
  "CAFFEINE" BOOLEAN CHECK(caffeine IN (NULL, 0, 1)),
  "NICOTINE" BOOLEAN CHECK(nicotine IN (NULL, 0, 1)),
  "COTININE" BOOLEAN CHECK(cotinine IN (NULL, 0, 1)),
  "DRUGS_OF_INTEREST" BOOLEAN CHECK(drugs_of_interest IN (NULL, 0, 1)),
  "ANY_HEROIN" BOOLEAN CHECK(any_heroin IN (NULL, 0, 1)),
  "ANY_FENTANYL" BOOLEAN CHECK(any_fentanyl IN (NULL, 0, 1)),
  "ANY_ILLICIT_OPIOID" BOOLEAN CHECK(any_illicit_opioid IN (NULL, 0, 1)),
  "ANY_PRESCRIPTION_OPIOID" BOOLEAN CHECK(any_prescription_opioid IN (NULL, 0, 1)),
  "ANY_OPIOID" BOOLEAN CHECK(any_opioid IN (NULL, 0, 1)),
  "ANY_BENZODIAZEPINE" BOOLEAN CHECK(any_benzodiazepine IN (NULL, 0, 1)),
  "ANY_COCAINE" BOOLEAN CHECK(any_cocaine IN (NULL, 0, 1)),
  "ANY_METHAMPHETAMINE" BOOLEAN CHECK(any_methamphetamine IN (NULL, 0, 1)),
  "DRUG_CONCENTRATIONS" BOOLEAN CHECK(drug_concentrations IN (NULL, 0, 1)),
  "6_MAM_AMOUNT" REAL CHECK(typeof("6_MAM_AMOUNT") = 'real'),
      -- Note: There are some with a <, removed and subtracted by 0.00012 on those
  "MORPHINE_AMOUNT" REAL CHECK(typeof(morphine_amount) = 'real'),
  "CODEINE_AMOUNT" REAL CHECK(typeof(codeine_amount) = 'real'),
  "FENTANYL_AMOUNT" REAL CHECK(typeof(fentanyl_amount) = 'real'),
  "NORFENTANYL_AMOUNT" REAL CHECK(typeof(norfentanyl_amount) = 'real'),
  "FENTANYL_ACETYL_AMOUNT" REAL CHECK(typeof(fentanyl_acetyl_amount) = 'real'),
  "FENTANYL_4ANPP_AMOUNT" REAL CHECK(typeof(fentanyl_4anpp_amount) = 'real'),
  "FURANYL_FENANTYL_AMOUNT" REAL CHECK(typeof(furanyl_fenantyl_amount) = 'real'),
  "FIBF_FENTANYL_AMOUNT" REAL CHECK(typeof(fibf_fentanyl_amount) = 'real'),
  "CARFENTANYL_AMOUNT" REAL CHECK(typeof(carfentanyl_amount) = 'real'),
  "OXYCODONE_AMOUNT" REAL CHECK(typeof(oxycodone_amount) = 'real'),
  "HYDROCODONE_AMOUNT" REAL CHECK(typeof(hydrocodone_amount) = 'real'),
  "OXYMORPHONE_AMOUNT" REAL CHECK(typeof(oxymorphone_amount) = 'real'),
  "HYDROMORPHONE_AMOUNT" REAL CHECK(typeof(hydromorphone_amount) = 'real'),
  "DIHYDROCODEINE_AMOUNT" REAL CHECK(typeof(dihydrocodeine_amount) = 'real'),
  "COCAINE_AMOUNT" REAL CHECK(typeof(cocaine_amount) = 'real'),
  "BENZOYLECGONINE_AMOUNT" REAL CHECK(typeof(benzoylecgonine_amount) = 'real'),
  "METHADONE_AMOUNT" REAL CHECK(typeof(methadone_amount) = 'real'),
  "AMPHETAMINE_AMOUNT" REAL CHECK(typeof(amphetamine_amount) = 'real'),
    -- Note: There are some with a <, removed and subtracted by 0.00012 on those
  "METHAMPHETAMINE_AMOUNT" REAL CHECK(typeof(methamphetamine_amount) = 'real'),
  "NOTES" BOOLEAN CHECK(notes IN (NULL, 0, 1))
    -- Note: there are no notes...
);
INSERT INTO deaths
  SELECT
    case_number,
    CAST(year AS INT),
    last_name,
    first_name,
    NULLIF(REPLACE(ssn, 'N/A', ''), ''),
    CASE sex WHEN '0' THEN 'F' WHEN '1' THEN 'M' ELSE NULL END,
    CASE race
        WHEN '1' THEN 'White'
        WHEN '2' THEN 'Black'
        WHEN '3' THEN 'Hispanic'
        WHEN '4' THEN 'Other'
        ELSE NULL
    END,
    date(dob),
    date(dod),
    CAST(age AS INT),
    CASE military
        WHEN '0' THEN 0
        WHEN '1' THEN 1
        ELSE NULL
    END,
    CASE employment
        WHEN '1' THEN 'Employed'
        WHEN '2' THEN 'Unemployed'
        WHEN '3' THEN 'Student'
        WHEN '4' THEN 'Disabled'
        WHEN '5' THEN 'Retired'
        ELSE NULL
    END,
    CASE education
        WHEN '1' THEN 'Under 8th grade'
        WHEN '2' THEN 'High school - Not finished'
        WHEN '3' THEN 'Graduated high school'
        WHEN '4' THEN 'Some college - No degree'
        WHEN '5' THEN 'Technical/vocational degree'
        WHEN '6' THEN 'College degree'
        WHEN '7' THEN 'Post graduation degree (Masters, PHD, MD, etc.)'
        ELSE NULL
    END,
    CASE marital_status
        WHEN '1' THEN 'Never married'
        WHEN '2' THEN 'Married'
        WHEN '3' THEN 'Separated'
        WHEN '4' THEN 'Widowed'
        WHEN '5' THEN 'Divorced'
        ELSE NULL
    END,
    home_address,
    home_city,
    CASE home_zip WHEN '' THEN 'Homeless' ELSE home_zip END,
    home_state,
    injury_address,
    CASE injury_city WHEN '' THEN 'Unknown' ELSE injury_city END,
    CASE injury_zip WHEN '' THEN 'Unknown' ELSE injury_zip END,
    CASE place_of_death
        WHEN '1' THEN 'Residence'
        WHEN '2' THEN 'Other Residence'
        WHEN '3' THEN 'Hospital-Inpatient'
        WHEN '4' THEN 'ER-Outpatient'
        ELSE NULL
    END,
    specific_place_of_death,
    CASE place_of_injury
        WHEN '1' THEN 'Residence'
        WHEN '2' THEN 'Other Residence'
        WHEN '3' THEN 'Workplace'
        ELSE NULL
    END,
    specific_place_of_injury,
    CASE describe_injury
        WHEN 'NA' THEN 'Unknown'
        WHEN '' THEN 'Unknown'
        ELSE describe_injury
    END,
    medical_history,
    CAST(NULLIF(drug_paraphernalia, '') AS BOOLEAN),
    CAST(NULLIF(needles_or_heroin, '') AS BOOLEAN),
    CAST(NULLIF(witness_mention_drugs, '') AS BOOLEAN),
    cause_of_death,
    CAST(NULLIF(primary_tox_lab, '') AS BOOLEAN),
    CAST(NULLIF(alcohols, '') AS BOOLEAN),
    CAST(NULLIF(ethanol, '') AS BOOLEAN),
    CAST(NULLIF(acetone, '') AS BOOLEAN),
    CAST(NULLIF(isopropanol, '') AS BOOLEAN),
    CAST(NULLIF(methanol, '') AS BOOLEAN),
    CAST(NULLIF(amphetamines, '') AS BOOLEAN),
    CAST(NULLIF(amphetamine, '') AS BOOLEAN),
    CAST(NULLIF(methamphetamine, '') AS BOOLEAN),
    CAST(NULLIF(ephedrine, '') AS BOOLEAN),
    CAST(NULLIF(mdma, '') AS BOOLEAN),
    CAST(NULLIF(mda, '') AS BOOLEAN),
    CAST(NULLIF(phenylpropanolamine, '') AS BOOLEAN),
    CAST(NULLIF(phentermine, '') AS BOOLEAN),
    CAST(NULLIF(analgesics, '') AS BOOLEAN),
    CAST(NULLIF(acetaminophen, '') AS BOOLEAN),
    CAST(NULLIF(salicylates, '') AS BOOLEAN),
    CAST(NULLIF(naproxen, '') AS BOOLEAN),
    CAST(NULLIF(antibiotics, '') AS BOOLEAN),
    CAST(NULLIF(azithromycin, '') AS BOOLEAN),
    CAST(NULLIF(piperacillin, '') AS BOOLEAN),
    CAST(NULLIF(levofloxacin, '') AS BOOLEAN),
    CAST(NULLIF(anticonvulsants, '') AS BOOLEAN),
    CAST(NULLIF(gabapentin, '') AS BOOLEAN),
    CAST(NULLIF(oxcarbazepine, '') AS BOOLEAN),
    CAST(NULLIF(topiramate, '') AS BOOLEAN),
    CAST(NULLIF(lamotrigine, '') AS BOOLEAN),
    CAST(NULLIF(levetiracetam, '') AS BOOLEAN),
    CAST(NULLIF(pregabalin, '') AS BOOLEAN),
    CAST(NULLIF(zonisamide, '') AS BOOLEAN),
    CAST(NULLIF(valproicacid, '') AS BOOLEAN),
    CAST(NULLIF(antidepressants, '') AS BOOLEAN),
    CAST(NULLIF(paroxetine, '') AS BOOLEAN),
    CAST(NULLIF(fluoxetine, '') AS BOOLEAN),
    CAST(NULLIF(norfluoxetine, '') AS BOOLEAN),
    CAST(NULLIF(mirtazapine, '') AS BOOLEAN),
    CAST(NULLIF(citalopram, '') AS BOOLEAN),
    CAST(NULLIF(trazodone, '') AS BOOLEAN),
    CAST(NULLIF(chlorophenylpiperazine, '') AS BOOLEAN),
    CAST(NULLIF(doxepin, '') AS BOOLEAN),
    CAST(NULLIF(nordoxepin, '') AS BOOLEAN),
    CAST(NULLIF(fluvoxamine, '') AS BOOLEAN),
    CAST(NULLIF(sertraline, '') AS BOOLEAN),
    CAST(NULLIF(norsertraline, '') AS BOOLEAN),
    CAST(NULLIF(desmethylsertraline, '') AS BOOLEAN),
    CAST(NULLIF(amitriptyline, '') AS BOOLEAN),
    CAST(NULLIF(nortriptyline, '') AS BOOLEAN),
    CAST(NULLIF(duloxetine, '') AS BOOLEAN),
    CAST(NULLIF(norvenlafaxine, '') AS BOOLEAN),
    CAST(NULLIF(bupropion, '') AS BOOLEAN),
    CAST(NULLIF(hydroxybupriopion, '') AS BOOLEAN),
    CAST(NULLIF(venlafaxine, '') AS BOOLEAN),
    CAST(NULLIF(odesmethylvenlafaxine, '') AS BOOLEAN),
    CAST(NULLIF(mcpp, '') AS BOOLEAN),
    CAST(NULLIF(desmethyldoxepin, '') AS BOOLEAN),
    CAST(NULLIF(antihistamines, '') AS BOOLEAN),
    CAST(NULLIF(hydroxyzine, '') AS BOOLEAN),
    CAST(NULLIF(diphenhydramine, '') AS BOOLEAN),
    CAST(NULLIF(doxylamine, '') AS BOOLEAN),
    CAST(NULLIF(chloropheniramine, '') AS BOOLEAN),
    CAST(NULLIF(guaifenesin, '') AS BOOLEAN),
    CAST(NULLIF(antipsycotics, '') AS BOOLEAN),
    CAST(NULLIF(clozapine, '') AS BOOLEAN),
    CAST(NULLIF(norclozapine, '') AS BOOLEAN),
    CAST(NULLIF(quetiapine, '') AS BOOLEAN),
    CAST(NULLIF(amlodipine, '') AS BOOLEAN),
    CAST(NULLIF(aripiprazole, '') AS BOOLEAN),
    CAST(NULLIF(olanzapine, '') AS BOOLEAN),
    CAST(NULLIF(buspirone, '') AS BOOLEAN),
    CAST(NULLIF(benzatropine, '') AS BOOLEAN),
    CAST(NULLIF(risperidone, '') AS BOOLEAN),
    CAST(NULLIF("9_HYDROXYRISPERIDONE", '') AS BOOLEAN),
    CAST(NULLIF(barbituates, '') AS BOOLEAN),
    CAST(NULLIF(phenobarbital, '') AS BOOLEAN),
    CAST(NULLIF(butalbital, '') AS BOOLEAN),
    CAST(NULLIF(benzodiazepine, '') AS BOOLEAN),
    CAST(NULLIF(lorazepam, '') AS BOOLEAN),
    CAST(NULLIF(clonazepam, '') AS BOOLEAN),
    CAST(NULLIF(nordiazapam, '') AS BOOLEAN),
    CAST(NULLIF(diazepam, '') AS BOOLEAN),
    CAST(NULLIF(alprazolam, '') AS BOOLEAN),
    CAST(NULLIF("7AMINOCLONAZEPAM", '') AS BOOLEAN),
    CAST(NULLIF(aohalprazolam, '') AS BOOLEAN),
    CAST(NULLIF(temazepam, '') AS BOOLEAN),
    CAST(NULLIF(oxazepam, '') AS BOOLEAN),
    CAST(NULLIF(chlordiazepoxide, '') AS BOOLEAN),
    CAST(NULLIF(alphahydroxyalprazolam, '') AS BOOLEAN),
    CAST(NULLIF(demoxepam, '') AS BOOLEAN),
    CAST(NULLIF(midazolam, '') AS BOOLEAN),
    CAST(NULLIF(flubramazolam, '') AS BOOLEAN),
    CAST(NULLIF(phenazepam, '') AS BOOLEAN),
    CAST(NULLIF(delorazepam, '') AS BOOLEAN),
    CAST(NULLIF(diclazepam, '') AS BOOLEAN),
    CAST(NULLIF(cardiovascular, '') AS BOOLEAN),
    CAST(NULLIF(verapamil, '') AS BOOLEAN),
    CAST(NULLIF(metoprolol, '') AS BOOLEAN),
    CAST(NULLIF(diltiazem, '') AS BOOLEAN),
    CAST(NULLIF(propranolol, '') AS BOOLEAN),
    CAST(NULLIF(hydrochlorothiazide, '') AS BOOLEAN),
    CAST(NULLIF(lidocaine, '') AS BOOLEAN),
    CAST(NULLIF(clonidine, '') AS BOOLEAN),
    CAST(NULLIF(gastrointestionals, '') AS BOOLEAN),
    CAST(NULLIF(promethazine, '') AS BOOLEAN),
    CAST(NULLIF(dicyclomine, '') AS BOOLEAN),
    CAST(NULLIF(loperamide, '') AS BOOLEAN),
    CAST(NULLIF(desmethylloperamide, '') AS BOOLEAN),
    CAST(NULLIF(illicits, '') AS BOOLEAN),
    CAST(NULLIF("6_MAM", '') AS BOOLEAN),
    CAST(NULLIF(heroin_from_combo, '') AS BOOLEAN),
    CAST(NULLIF(cocaine, '') AS BOOLEAN),
    CAST(NULLIF(benzoylecgonine, '') AS BOOLEAN),
    CAST(NULLIF(cocaethylene, '') AS BOOLEAN),
    CAST(NULLIF(pcp, '') AS BOOLEAN),
    CAST(NULLIF(thc, '') AS BOOLEAN),
    CAST(NULLIF(thc_cooh, '') AS BOOLEAN),
    CAST(NULLIF(carboxy_thc, '') AS BOOLEAN),
    CAST(NULLIF(delta_9_thc, '') AS BOOLEAN),
    CAST(NULLIF(delta_9_carboxy_thc, '') AS BOOLEAN),
    CAST(NULLIF("11_HYDROXY_DELTA_9_THC", '') AS BOOLEAN),
    CAST(NULLIF("5F_ADB_THC_SYNTHETIC", '') AS BOOLEAN),
    CAST(NULLIF(cannibidiol_aggregate, '') AS BOOLEAN),
    CAST(NULLIF(opioids, '') AS BOOLEAN),
    CAST(NULLIF(morphine, '') AS BOOLEAN),
    CAST(NULLIF(codeine, '') AS BOOLEAN),
    CAST(NULLIF(fentanyl, '') AS BOOLEAN),
    CAST(NULLIF(norfentanyl, '') AS BOOLEAN),
    CAST(NULLIF(acetylfetanyl, '') AS BOOLEAN),
    CAST(NULLIF(acrylfentanyl, '') AS BOOLEAN),
    CAST(NULLIF(para_fluorobutyryl_fentanyl, '') AS BOOLEAN),
    CAST(NULLIF(fentanyl_4_anpp, '') AS BOOLEAN),
    CAST(NULLIF(methoxyacetyl_fentanyl, '') AS BOOLEAN),
    CAST(NULLIF(furanyl_fetanyl, '') AS BOOLEAN),
    CAST(NULLIF(carfentanil, '') AS BOOLEAN),
    CAST(NULLIF(oxycodone, '') AS BOOLEAN),
    CAST(NULLIF(hydrocodone, '') AS BOOLEAN),
    CAST(NULLIF(oxymorphone, '') AS BOOLEAN),
    CAST(NULLIF(hydromorphone, '') AS BOOLEAN),
    CAST(NULLIF(dihydrocodeine, '') AS BOOLEAN),
    CAST(NULLIF(opiates, '') AS BOOLEAN),
    CAST(NULLIF(buprenorphine, '') AS BOOLEAN),
    CAST(NULLIF(norbuprenorphine, '') AS BOOLEAN),
    CAST(NULLIF(normeperidine, '') AS BOOLEAN),
    CAST(NULLIF(u477, '') AS BOOLEAN),
    CAST(NULLIF(tramadol, '') AS BOOLEAN),
    CAST(NULLIF(nortramadol, '') AS BOOLEAN),
    CAST(NULLIF("O-DESMETHYLTRAMADOL", '') AS BOOLEAN),
    CAST(NULLIF(tramadol_aggregate, '') AS BOOLEAN),
    CAST(NULLIF(methadone, '') AS BOOLEAN),
    CAST(NULLIF(eddp, '') AS BOOLEAN),
    CAST(NULLIF(mitragynine, '') AS BOOLEAN),
    CAST(NULLIF(norcodeine, '') AS BOOLEAN),
    CAST(NULLIF(opioid_antagonist, '') AS BOOLEAN),
    CAST(NULLIF(naloxone, '') AS BOOLEAN),
    CAST(NULLIF(miscellaneous, '') AS BOOLEAN),
    CAST(NULLIF(hydroxychloroquine, '') AS BOOLEAN),
    CAST(NULLIF(atenolol, '') AS BOOLEAN),
    CAST(NULLIF(narcotics, '') AS BOOLEAN),
    CAST(NULLIF(glucose, '') AS BOOLEAN),
    CAST(NULLIF(carboxyhemoglobin, '') AS BOOLEAN),
    CAST(NULLIF(psychoactivesubstances, '') AS BOOLEAN),
    CAST(NULLIF(difluoroethane, '') AS BOOLEAN),
    CAST(NULLIF(amiodarone, '') AS BOOLEAN),
    CAST(NULLIF(yohimbine, '') AS BOOLEAN),
    CAST(NULLIF(gilipizide, '') AS BOOLEAN),
    CAST(NULLIF(sildenafil, '') AS BOOLEAN),
    CAST(NULLIF(quinine, '') AS BOOLEAN),
    CAST(NULLIF(levamisole, '') AS BOOLEAN),
    CAST(NULLIF(n_desmethylsildenafil, '') AS BOOLEAN),
    CAST(NULLIF("6_BETA_NALTREXOL", '') AS BOOLEAN),
    CAST(NULLIF(muscle_relaxants, '') AS BOOLEAN),
    CAST(NULLIF(methocarbamol, '') AS BOOLEAN),
    CAST(NULLIF(tizanadine, '') AS BOOLEAN),
    CAST(NULLIF(cyclobenzaprine, '') AS BOOLEAN),
    CAST(NULLIF(carisoprodol, '') AS BOOLEAN),
    CAST(NULLIF(meprobamate, '') AS BOOLEAN),
    CAST(NULLIF(orphenadrine, '') AS BOOLEAN),
    CAST(NULLIF(neurologicals, '') AS BOOLEAN),
    CAST(NULLIF(benztropine, '') AS BOOLEAN),
    CAST(NULLIF(otc_cold_remedies, '') AS BOOLEAN),
    CAST(NULLIF(dextromethorphan, '') AS BOOLEAN),
    CAST(NULLIF(pseudoephedrine, '') AS BOOLEAN),
    CAST(NULLIF(norpseudoephedrine, '') AS BOOLEAN),
    CAST(NULLIF(sedatives_hypnotics, '') AS BOOLEAN),
    CAST(NULLIF(eszopiclone, '') AS BOOLEAN),
    CAST(NULLIF(zolpidem, '') AS BOOLEAN),
    CAST(NULLIF(stimulants, '') AS BOOLEAN),
    CAST(NULLIF(caffeine, '') AS BOOLEAN),
    CAST(NULLIF(nicotine, '') AS BOOLEAN),
    CAST(NULLIF(cotinine, '') AS BOOLEAN),
    CAST(NULLIF(drugs_of_interest, '') AS BOOLEAN),
    CAST(NULLIF(any_heroin, '') AS BOOLEAN),
    CAST(NULLIF(any_fentanyl, '') AS BOOLEAN),
    CAST(NULLIF(any_illicit_opioid, '') AS BOOLEAN),
    CAST(NULLIF(any_prescription_opioid, '') AS BOOLEAN),
    CAST(NULLIF(any_opioid, '') AS BOOLEAN),
    CAST(NULLIF(any_benzodiazepine, '') AS BOOLEAN),
    CAST(NULLIF(any_cocaine, '') AS BOOLEAN),
    CAST(NULLIF(any_methamphetamine, '') AS BOOLEAN),
    CAST(NULLIF(drug_concentrations, '') AS BOOLEAN),
    CASE WHEN "6_MAM_AMOUNT" GLOB '<*' THEN CAST(REPLACE("6_MAM_AMOUNT", '<', '') AS REAL) - 0.000012 ELSE CAST("6_MAM_AMOUNT" AS REAL) END,
    CASE WHEN morphine_amount GLOB '<*' THEN CAST(REPLACE(morphine_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(morphine_amount AS REAL) END,
    CASE WHEN codeine_amount GLOB '<*' THEN CAST(REPLACE(codeine_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(codeine_amount AS REAL) END,
    CASE WHEN fentanyl_amount GLOB '<*' THEN CAST(REPLACE(fentanyl_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(fentanyl_amount AS REAL) END,
    CASE WHEN norfentanyl_amount GLOB '<*' THEN CAST(REPLACE(norfentanyl_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(norfentanyl_amount AS REAL) END,
    CASE WHEN fentanyl_acetyl_amount GLOB '<*' THEN CAST(REPLACE(fentanyl_acetyl_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(fentanyl_acetyl_amount AS REAL) END,
    CASE WHEN fentanyl_4anpp_amount GLOB '<*' THEN CAST(REPLACE(fentanyl_4anpp_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(fentanyl_4anpp_amount AS REAL) END,
    CASE WHEN furanyl_fenantyl_amount GLOB '<*' THEN CAST(REPLACE(furanyl_fenantyl_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(furanyl_fenantyl_amount AS REAL) END,
    CASE WHEN fibf_fentanyl_amount GLOB '<*' THEN CAST(REPLACE(fibf_fentanyl_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(fibf_fentanyl_amount AS REAL) END,
    CASE WHEN carfentanyl_amount GLOB '<*' THEN CAST(REPLACE(carfentanyl_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(carfentanyl_amount AS REAL) END,
    CASE WHEN oxycodone_amount GLOB '<*' THEN CAST(REPLACE(oxycodone_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(oxycodone_amount AS REAL) END,
    CASE WHEN hydrocodone_amount GLOB '<*' THEN CAST(REPLACE(hydrocodone_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(hydrocodone_amount AS REAL) END,
    CASE WHEN oxymorphone_amount GLOB '<*' THEN CAST(REPLACE(oxymorphone_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(oxymorphone_amount AS REAL) END,
    CASE WHEN hydromorphone_amount GLOB '<*' THEN CAST(REPLACE(hydromorphone_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(hydromorphone_amount AS REAL) END,
    CASE WHEN dihydrocodeine_amount GLOB '<*' THEN CAST(REPLACE(dihydrocodeine_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(dihydrocodeine_amount AS REAL) END,
    CASE WHEN cocaine_amount GLOB '<*' THEN CAST(REPLACE(cocaine_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(cocaine_amount AS REAL) END,
    CASE WHEN benzoylecgonine_amount GLOB '<*' THEN CAST(REPLACE(benzoylecgonine_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(benzoylecgonine_amount AS REAL) END,
    CASE WHEN methadone_amount GLOB '<*' THEN CAST(REPLACE(methadone_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(methadone_amount AS REAL) END,
    CASE WHEN amphetamine_amount GLOB '<*' THEN CAST(REPLACE(amphetamine_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(amphetamine_amount AS REAL) END,
    CASE WHEN methamphetamine_amount GLOB '<*' THEN CAST(REPLACE(methamphetamine_amount, '<', '') AS REAL) - 0.000012 ELSE CAST(methamphetamine_amount AS REAL) END,
    CAST(NULLIF(notes, '') AS BOOLEAN)
  FROM od_deaths_raw;

CREATE UNIQUE INDEX deaths_pk ON deaths(case_number);