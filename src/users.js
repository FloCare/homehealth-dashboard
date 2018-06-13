import React from 'react';
import { List, Datagrid, EmailField, TextField } from 'react-admin';

export const UserList = (props) => (
    <List title="All users" {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="username" />
            <EmailField source="email" />
            <TextField source="contact_no" />
        </Datagrid>
    </List>
);