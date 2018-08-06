import React from 'react';
import { List, Datagrid, EmailField, TextField, Create, Edit, SimpleForm, TextInput, EditButton, SelectInput } from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';

const UserPagination = () => {
    return (
        false
    );
}

const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

const validateUserCreation = (values) => {
    const errors = {};
    const email = values.email;
    const primaryContact = values.contact_no;
    if (!values.first_name) {
        errors.first_name = ['Required'];
    }
    if (!values.last_name) {
        errors.last_name = ['Required'];
    }
    if (!values.password) {
        errors.password = ['Required'];
    }
    if (!values.user_role) {
        errors.user_role = ['Required'];
    }
    if (!email) {
        errors.email = ['Required'];
    }
    if(validateEmail(email) === false) {
        errors.email = ['Enter a valid email'];
    }
    if (!primaryContact) {
        errors.contact_no = ['Required'];
    }
    if (!primaryContact ||  isNaN(primaryContact)) {
        errors.contact_no = ['Phone Number can only contain numerics'];
    }
    else if (!primaryContact || primaryContact.length < 10) {
        errors.contact_no = ['Phone Number incomplete'];
    }

    return errors
};

const styles = {
    inlineBlock: { display: 'inline-flex', marginRight: '15rem' },
    block: { display: 'inline-block', marginRight: '1rem' },
    textStyle: { fontSize: 34, color: 'black', fontWeight: 'bold'}
};

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

export const UserCreate = withStyles(styles)(({ classes, ...props }) => (
    <Create title="Add Staff" {...props}>
        <SimpleForm redirect="list" validate={validateUserCreation}>
            <TextInput label="First Name" source="first_name" formClassName={classes.inlineBlock}/>
            <TextInput label="Last Name" source="last_name" formClassName={classes.inlineBlock}/>
            <TextInput label="Password" source="password" type="password" formClassName={classes.inlineBlock}/>
            <SelectInput source="user_role" choices={[
                { id: 'LPN', name: 'LPN' },
                { id: 'PTA', name: 'PTA' },
            ]} formClassName={classes.inlineBlock}/>
            <TextInput label="Email" source="email" formClassName={classes.inlineBlock}/>
            <TextInput label="Phone Number" source="contact_no" formClassName={classes.inlineBlock}/>
        </SimpleForm>
    </Create>
));

export const UserEdit = withStyles(styles)(({ classes, ...props }) => (
    <Edit title="Edit Staff" {...props}>
        <SimpleForm validate={validateUserCreation}>
            <TextInput label="First Name" source="first_name" formClassName={classes.inlineBlock}/>
            <TextInput label="Last Name" source="last_name" formClassName={classes.inlineBlock}/>
            <TextInput label="Password" source="password" type="password" formClassName={classes.inlineBlock}/>
            <SelectInput source="user_role" choices={[
                { id: 'LPN', name: 'LPN' },
                { id: 'PTA', name: 'PTA' },
            ]} formClassName={classes.inlineBlock}/>
            <TextInput label="Email" source="email" formClassName={classes.inlineBlock}/>
            <TextInput label="Phone Number" source="contact_no" formClassName={classes.inlineBlock}/>
        </SimpleForm>
    </Edit>
));