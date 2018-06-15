import React from 'react';
import { fetchUtils, Admin, Resource } from 'react-admin';
import PatientIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';
import { PatientList, PatientEdit } from './patients';
import PatientCreate from './PatientCreate';
import { UserList } from './users';
import Dashboard from './dashboard';
import authProvider from './authProvider';
import dataProvider from './dataProvider';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('token');
    return fetchUtils.fetchJson(url, options);
}
// const dataProvider = simpleRestProvider('https://fathomless-harbor-75587.herokuapp.com', httpClient);

const App = () => (
    <Admin 
    title="Team Version"
    dashboard={Dashboard}
    authProvider={authProvider}
    dataProvider={dataProvider}
    >
        <Resource name="phi/" options={{ label: 'Patients' }} list={PatientList} edit={PatientEdit} create={PatientCreate} icon={PatientIcon} />
        <Resource name="users/" options={{ label: 'Users' }} list={UserList} icon={UserIcon} />
    </Admin>
);

export default App;