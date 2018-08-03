import React from 'react';
import { List, Datagrid, EmailField, TextField, Create, Edit, SimpleForm, TextInput, EditButton } from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';

const UserPagination = () => {
    return (
        false
    );
}

export const UserList = (props) => (
    <List title="Staff" {...props} pagination={<UserPagination />} bulkActions={false}>
        <Datagrid>
            <TextField label="First Name" source="first_name" />
            <TextField label="Last Name" source="last_name" />
            <TextField label="Role" source="user_role" />
            <EmailField label="email" source="email" />
            <TextField label="Phone Number" source="contact_no" />
            <EditButton />
        </Datagrid>
    </List>
);

export const UserCreate = (props) => (
    <Create title="Create Staff" {...props}>
        <SimpleForm redirect="list">
            <TextInput label="First Name" source="first_name" />
            <TextInput label="Last Name" source="last_name" />
            <TextInput label="Password" source="password" type="password"/>
            <TextInput label="Role" source="user_role" />
            <TextInput label="email" source="email" />
            <TextInput label="Phone Number" source="contact_no" />
        </SimpleForm>
    </Create>
);

export const UserEdit = (props) => (
    <Edit title="Edit Staff" {...props}>
        <SimpleForm>
            <TextInput label="First Name" source="first_name" />
            <TextInput label="Last Name" source="last_name" />
            <TextInput label="Password" source="password" type="password"/>
            <TextInput label="Role" source="user_role" />
            <TextInput label="email" source="email" />
            <TextInput label="Phone Number" source="contact_no" />
        </SimpleForm>
    </Edit>
);