import React from 'react';
import { List, Datagrid, EmailField, TextField, Create, Edit, SimpleForm,
    TextInput, EditButton, SelectInput, BooleanInput , BooleanField, CardActions,
    ListButton, RefreshButton, CreateButton, FunctionField,
    SaveButton, Toolbar} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import UserEdit from './UserEdit';
import {Link} from 'react-router-dom';

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

const validateUserEdit = (values) => {
    const errors = {};
    const email = values.email;
    const primaryContact = values.contact_no;
    if (!values.first_name) {
        errors.first_name = ['Required'];
    }
    if (!values.last_name) {
        errors.last_name = ['Required'];
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
    textStyle: { fontSize: 34, color: 'black', fontWeight: 'bold'},
    button: {
        // This is JSS syntax to target a deeper element using css selector, here the svg icon for this button
        '& svg': { color: '#64CCC9' },
        color: '#64CCC9',
        backgroundColor: 'transparent'
    },
    emailFieldStyle: { color: '#64CCC9' },
};

const StaffEditActions = ({ basePath, data, resource }) => (
    <CardActions>
        <ListButton basePath={basePath} />
        <RefreshButton />
    </CardActions>
);

// Todo: Figure out a better way to do this
const renderReportLink = (record) => {
    return (
        <Link to={`/reports?userID=${record.id}`} style={{ color: '#64CCC9' }}>View Reports</Link>
    );
};

const UserActions = withStyles(styles)(({bulkActions, basePath, classes}) => (
    <CardActions>
        <CreateButton basePath={basePath} className={classes.button}/>
        <RefreshButton className={classes.button}/>
    </CardActions>
));

export const UserList = withStyles(styles)(({ classes, ...props }) => (
    <List title="Staff" {...props} actions={<UserActions />} pagination={<UserPagination />} bulkActions={false} sort={{ order: 'ASC' }}>
        <Datagrid>
            <TextField label="First Name" source="first_name" />
            <TextField label="Last Name" source="last_name" />
            <TextField label="Role" source="user_role" sortable={false}/>
            <EmailField label="email" source="email" sortable={false} className={classes.emailFieldStyle}/>
            <FunctionField label="View Reports" render={renderReportLink} />
            <TextField label="Phone Number" source="contact_no" sortable={false}/>
            <EditButton className={classes.button}/>
        </Datagrid>
    </List>
));

const UserCreateToolbar = withStyles(styles)(({ classes, ...props }) => (
    <Toolbar {...props}>
        <SaveButton
            className={classes.button}
            label="Save"
            redirect="show"
            submitOnEnter={true}
        />
    </Toolbar>
));

const UserEditActions = withStyles(styles)(({ basePath, data, classes }) => (
    <CardActions>
        <ListButton className={classes.button} basePath={basePath} record={data} />
        <RefreshButton className={classes.button}/>
    </CardActions>
));

export const UserCreate = withStyles(styles)(({ classes, ...props }) => (
    <Create title="Add Staff" {...props}>
        <SimpleForm redirect="list" validate={validateUserCreation}>
            <TextInput label="First Name" source="first_name" formClassName={classes.inlineBlock}/>
            <TextInput label="Last Name" source="last_name" formClassName={classes.inlineBlock}/>
            <TextInput label="Password" source="password" type="password" placeholder={'******'} formClassName={classes.inlineBlock}/>
            <SelectInput source="user_role" choices={[
                { id: 'LPN', name: 'LPN' },
                { id: 'PTA', name: 'PTA' },
            ]} formClassName={classes.inlineBlock}/>
            <TextInput label="Email" source="email" formClassName={classes.inlineBlock}/>
            <TextInput label="Phone Number" source="contact_no" formClassName={classes.inlineBlock}/>
        </SimpleForm>
    </Create>
));

export const StaffEdit = withStyles(styles)(({ classes, ...props }) => {
    return (
        <Edit title="Edit Staff" {...props} actions={<UserEditActions />}>
            <UserEdit {...props} toolbar={<UserEditActions/>}/>
        </Edit>
    );
});