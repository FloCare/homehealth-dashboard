import React from 'react';
import { List, Datagrid, EmailField, TextField } from 'react-admin';

export const UserList = (props) => (
    <List title="Users" {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="first_name" />
            <TextField source="last_name" />
            <EmailField source="email" />
            <TextField source="contact_no" />
        </Datagrid>
    </List>
);