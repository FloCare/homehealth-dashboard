import React from 'react';
import { List, Datagrid, EmailField, TextField } from 'react-admin';

const UserPagination = () => {
    return (
        false
    );
}

export const UserList = (props) => (
    <List title="Staff" {...props} pagination={<UserPagination />}>
        <Datagrid>
            <TextField label="First Name" source="first_name" />
            <TextField label="Last Name" source="last_name" />
            <TextField label="Role" source="user_role" />
            <EmailField label="email" source="email" />
            <TextField label="Phone Number" source="contact_no" />
        </Datagrid>
    </List>
);