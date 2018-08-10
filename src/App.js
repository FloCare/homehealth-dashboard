import React from 'react';
import { Admin, Resource } from 'react-admin';
import PatientIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';
import { PatientList, PatientCreate, PatientEdit } from './patient/patients';
import PhysicianCreate from './physician/PhysicianCreate'
import {PhysicianList} from './physician/PhysicianList'
import { UserList, StaffEdit } from './user/users';
import UserCreate from './user/UserCreate';
import authProvider from './authProvider';
import dataProvider from './dataProvider';

require('../node_modules/material-components-web/dist/material-components-web.min.css')
// import { createMuiTheme } from '@material-ui/core/styles';

// const theme = createMuiTheme({
//   palette: {
//     type: 'dark', // Switching the dark mode on is a single property value change.
//   },
// });

// TODO logic to be changed in authProvider , depending on logged in Org user
var organizationName = localStorage.getItem('organizationName') ? localStorage.getItem('organizationName') : 'FloCare Admin Dashboard';

const App = () => (
    <Admin
        title={organizationName}
        authProvider={authProvider}
        dataProvider={dataProvider}
    >
        <Resource name="phi" options={{label: 'Patients'}} list={PatientList} edit={PatientEdit} create={PatientCreate} icon={PatientIcon} />
        <Resource name="users" options={{label: 'Staff'}} list={UserList} edit={StaffEdit} create={UserCreate} icon={UserIcon} />
        <Resource name="physicians"
                  options={{label: 'Physicians'}}
                  create={PhysicianCreate}
                  list={PhysicianList}
                  icon={UserIcon} />
    </Admin>
);

export default App;