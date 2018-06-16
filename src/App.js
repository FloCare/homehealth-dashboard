import React from 'react';
import { Admin, Resource } from 'react-admin';
import PatientIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';
import { PatientList } from './patients';
import PatientCreate from './PatientCreate';
import PatientEdit from './PatientEdit';
import { UserList } from './users';
import authProvider from './authProvider';
import dataProvider from './dataProvider';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
});

// const httpClient = (url, options = {}) => {
//     if (!options.headers) {
//         options.headers = new Headers({ Accept: 'application/json' });
//     }
//     const token = localStorage.getItem('token');
//     return fetchUtils.fetchJson(url, options);
// }
// const dataProvider = simpleRestProvider('https://fathomless-harbor-75587.herokuapp.com', httpClient);

const App = () => (
    <Admin 
    title="FloCare Team Version"
    authProvider={authProvider}
    dataProvider={dataProvider}
    >
        <Resource name="phi/" options={{ label: 'Patients' }} list={PatientList} edit={PatientEdit} create={PatientCreate} icon={PatientIcon} />
        <Resource name="users/" options={{ label: 'Users' }} list={UserList} icon={UserIcon} />
    </Admin>
);

export default App;