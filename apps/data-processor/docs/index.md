# About
-------

## What is the A2AGC Dataset?

Indiana University's Addictions Crisis Grand Challenge (AGC) is making a significant investment in addressing the opioid epidemic in Indiana. The AGC has three primary goals: (1) reducing the incidence of substance use disorder, (2) decreasing the number of opioid overdose fatalities, and (3) reducing the number of babies born with Neonatal Abstinence Syndrome. The AGC has funded 16 projects in its first phase in 2017 and 15 more in its second phase in 2018.

Currently, the AGC does not have a comprehensive, generalizable mechanism to evaluate outcomes of the initiative of individual projects. Our project, *Advanced Analytics for IU's Addictions Grand Challenge (A2AGC)*, will help address this gap by partnering with the Indiana Addictions Data Commons (IADC). We will (1) construct an individually-linked, rich dataset of individuals who experienced fatal and non-fatal opioid overdoses in Marion County; (2) conduct a case-control study to determine risk factors for death from opioid OD; (3) help identify opportunities for interventions to prevent OD deaths; and (4) disseminate the developed analytics and visualization approach to other AGC projects, and evaluate the A2AGC. The outcome of this project will be a foundational platform for research, policy development and practical interventions.

The Advanced Analytics for IU's Addictions Grand Challenge (A2AGC) database is generated using code available on GitHub at [https://github.com/cns-iu/a2agc-dataset](https://github.com/cns-iu/a2agc-dataset).

See the latest changes in the [CHANGELOG](CHANGELOG.md).

## Data Source Information

| Dataset | Drug Overdose Deaths | Emergency Medical Services | Arrest Information | Healthcare Institutions |
|--------------|---------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| **Type of Data** | Coroner's reports of accidental overdose deaths including toxicology and death certificates | Individual run data of EMS services, including location, chief complaint, and mechanism of injury | Jail booking and release date, including reason for jail admission | hospital admission, discharge, lab reports, diagnoses, medications dispensed, procedures, referrals, and encounters |
| **Years** | 2010-2018 | 2011-2018 | 2014-2018 | 2005-Present |
| **Source** | Marion County Coroner's Office (MCCO) | Indianapolis Emergency Medical Services (IEMS) | Marion County Sheriff's Office (MCSO) | Indiana Network for Patient Care (INPC) |
| **Obtainment** | Manual collection at MCCO | Request from IEMS | Request from MCSO | Regenstrief Institute Data Core |
| **Location** | Marion County, IN | Marion County, IN | Marion County, IN | Marion County, IN |

### Drug Overdose Deaths

Data from the Marion County Coroner's Office (MCCO) provided us with the starting basis for our entire data linkage. MCCO provided us with vital record and toxicology information on all the accidental fatal overdoses that occurred in Marion County, Indiana, for the years 2010-2018. Vital records include the entire death certification for each decedent. Demographic information for each respective cases includes name, sex, race, date of birth, home address, marital status, education and employment. Toxicology reports contain information on all substances that were detected in the decedent at the time of their death.

In order to help us obtain this information, the MCCO first provides a list of case numbers which have been determined to be accidental fatal overdoses. Afterwards, a researcher logs into MCCO's database to search for each case and manually extract information from vital records and toxicology reports. Data collection for toxicology data has been ongoing since 2015 by Brad Ray, Director, Center for Behavioral Health and Justice at Wayne State University.

### Emergency Medical Services

Indianapolis Emergency Medical Services (IEMS) provides data on all first responder runs that IEMS were called to from 2011-2018. This data contains the demographic information (first and last name, gender, race, date of birth, and age) of the person who the run was called for, location and time of the run, and the reasons why EMS was called (chief complaints and mechanism of injury). This data was provided upon request directly by IEMS. 

### Arrest Information

The sheriff's office provided data on all jail bookings that occurred in Marion County from 2014-2018. Information that is available within this dataset includes demographic information (first and last name, gender, race, birth date, and age), booking and release date, description of the offense, and jail admission information. The data was provided upon request directly from MSCO.

### Regenstrief Institute Data Core

The Indiana Network for Patient Care (INPC) is managed by the Regenstrief Institute and provides data from major hospitals, health networks, physician practices and insurance providers. Data provided from the INCP includes hospital admission data, discharge data, lab reports, diagnoses data, medications dispensed, procedure data, referral information, and encounter information (which includes emergency visits, inpatient/outpatient visits, or ambulatory encounters) starting from 2005. The data was provided directly by the Regenstrief Institute.

### Information on Data Linkage

All data sources were linked by the Data Core at the Regenstrief Institute. The initial linkage was based off of all the accidental fatal overdoses that occurred in Marion County from 2010-2018. This comprised of approximately 2,300 cases in the 9 year time period. Data was linked primarily using the decedent first and last name, date of birth, and social security number (if available). Both IEMS and jail data contained only first and last name, and date of birth for linkage. We were able to match data from INPC using social security numbers as well as using the identifiers previously mentioned.

### Obtaining the Data

Beyond the coroner's data with toxicology and death certification information, all data sources were obtained by request from their respective agencies.

### Availability of the data for research

Due to the unique nature of the data set, our research group is very interested in making the data set available to highly qualified and experienced research collaborators and partners.  If you are interested, please contact Dr. Titus Schleyer, DMD, PhD, at [schleyer@regenstrief.org](mailto:schleyer@regenstrief.org).

## Credits

Developed as a collaboration between the [Cyberinfrastructure for Network Science Center at Indiana University](http://cns.iu.edu/) and the [Regenstrief Institute](https://www.regenstrief.org/) as part of Indiana University's [Addictions Grand Challenge](https://addictions.iu.edu/responding-to-crisis/grand-challenge.html).
