import React from 'react';
import { Admin, Resource } from 'react-admin';
import PatientIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';
import { PatientList, PatientCreate, PatientEdit } from './components/patient/patients';
import { PlacesList, PlacesCreate, PlacesEdit } from './components/places/places';
import PhysicianCreate from './components/physician/PhysicianCreate'
import {PhysicianList} from './components/physician/PhysicianList'
import {PhysicianEdit} from './components/physician/PhysicianEdit'
import { UserList, StaffEdit } from './components/user/users';
import UserCreate from './components/user/UserCreate';
import authProvider from './authProvider';
import dataProvider from './dataProvider';
import Scheduler from './components/scheduler/scheduler';
import {ViewReports} from './components/reports/ViewReports';
import ShowReport from './components/reports/ShowReport';
import appLayout from './components/appLayout';
import {RESOURCE_PHI, RESOURCE_USERS, RESOURCE_PHYSICIANS, RESOURCE_REPORTS, RESOURCE_STOPS} from './utils/constants';

require('../node_modules/material-components-web/dist/material-components-web.min.css')
// import { createMuiTheme } from '@material-ui/core/styles';

// const theme = createMuiTheme({
//   palette: {
//     type: 'dark', // Switching the dark mode on is a single property value change.
//   },
// });

var organizationName = localStorage.getItem('organizationName') ? localStorage.getItem('organizationName') : 'FloCare Admin Dashboard';

const App = () => (
    <Admin
        title={organizationName}
        authProvider={authProvider}
        dataProvider={dataProvider}
        appLayout={appLayout}
    >
        <Resource name={RESOURCE_PHI} options={{label: 'Patients'}} list={PatientList} edit={PatientEdit} create={PatientCreate} />
        <Resource name={RESOURCE_USERS} options={{label: 'Staff'}} list={UserList} edit={StaffEdit} create={UserCreate} />
        <Resource name={RESOURCE_STOPS} options={{label: 'Places'}} list={PlacesList} edit={PlacesEdit} create={PlacesCreate} />
        <Resource name={RESOURCE_PHYSICIANS}
                  options={{label: 'Physicians'}}
                  create={PhysicianCreate}
                  edit={PhysicianEdit}
                  list={PhysicianList}
                   />
        <Resource name="scheduler"
                  options={{label: 'Scheduler'}}
                  list={Scheduler}
        />
        <Resource name={RESOURCE_REPORTS} options={{label: 'Reports'}} list={ViewReports} show={ShowReport} />
    </Admin>
);

export default App;