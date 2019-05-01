# Summary:
This is part of the Flocare project and is the web dashboard side intended to be used by back office of the home-health
 to manage their clinicians.
 This dashboard interacts with the backend service to fetch any information and update the system with any new data.
 
This dashboard is built using react-admin. (https://github.com/marmelab/react-admin)

#### Other services:
1. Backend - #TODO fill github repo here
2. Mobile App (android/ios repo) - #TODO fill github repo here


#### Entity Definition:
The major entities are listed and defined below. For the complete list of entities browse in models.py for the 
different modules (phi/models.py, user_auth/models.py and flocarebase/models.py)

##### Patient:
The patient that the office and clinicians track. Created by admin from the dashboard
 (Refer to `Other services` heading). Can be assigned to clinicians of this home health through the dashboard. Once
 assigned, these patients are synced to the mobile apps of the respective clinicians. The clinicians can now start
 creating visits for this patient.  

##### Admin:
Admin is responsible for creating the patients, assigning them to the clinicians. The dashboard provides both week
 view and map view for intelligent scheduling.
 
The admin can also view the reports of the users and take actions(initiate reimbursement) based on the mileage reports 
of each user. 

##### Care Team:
A patient can be taken care of by multiple clinicians. All these clinicians form the care team for this patient.


##### Clinicians:
The main users of the mobile app. They have a list of patients that they need to take care of and create visits for
 their patients. The clinicians have multiple roles (RN - Registered nurse, PT - Physical Therapist, etc.

##### Places:
There is a list of places that can be created through the admin dashboard. These are common to all the clinicians in
 their home health and will be synced to their mobile apps. They could include places like a lab or hospital that their
 clinicians might go to. 

##### Visit:
Clinicians create visits for the patients/place for a particular date that they need to visit the patient on. They can set
 the time of the visit and for patient visits this information is synced to all members of the careteam.
 
A visit may also have mileage information associated with it. This mileage information is sent from the app to the
 backend service).  


##### Physician:
A physician is a doctor/surgeon in the hospitals. Uniquely identified by their NPI id, they are created from the
 admin dashboard. A patient can have a physician assigned to them.

##### Report:
Clinicians may create a report according to the cycle followed in their home-health(15 days - 30 days). This report will
 have the visit information and the mileage information for each of the visit. On submitting this report, the report
 is sent to the backend and is then viewable on the dashboard.  
 
  
# Installation and Usage Instructions:

##### Intall Dependencies:
`npm install`

##### Starting the server
`npm run start`

#### Key Changes:
The following keys need to be added for the app to completely work.

|Key    | File Location   | Description |
|-------|----------------  | ------ | 
|BASE_URL | src/utils/constants.js | URL for the backend service  |
