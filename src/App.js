import React from 'react';
import { Admin, Resource } from 'react-admin';
import PatientIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';
import { PatientList, PatientCreate, PatientEdit } from './patients';
import PhysicianCreate from './physician/PhysicianCreate'
import {PhysicianList} from './physician/PhysicianList'
import { UserList } from './users';
import authProvider from './authProvider';
import dataProvider from './dataProvider';

require('../node_modules/material-components-web/dist/material-components-web.min.css')
// import { createMuiTheme } from '@material-ui/core/styles';

// const theme = createMuiTheme({
//   palette: {
//     type: 'dark', // Switching the dark mode on is a single property value change.
//   },
// });

const App = () => (
    <Admin
        title="FloCare Admin Dashboard"
        authProvider={authProvider}
        dataProvider={dataProvider}
    >
        <Resource name="phi" options={{label: 'Patients'}} list={PatientList} edit={PatientEdit} create={PatientCreate} icon={PatientIcon} />
        <Resource name="users" options={{label: 'Staff'}} list={UserList} icon={UserIcon} />
        <Resource name="physicians"
                  options={{label: 'Physicians'}}
                  create={PhysicianCreate}
                  list={PhysicianList}
                  icon={UserIcon} />
    </Admin>
);

export default App;