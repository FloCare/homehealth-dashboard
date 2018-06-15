import React from 'react';
import { List, Edit, Create, Datagrid, TextField, EditButton, ReferenceInput, SelectInput, SimpleForm, TextInput, Filter, TabbedForm, FormTab, SelectArrayInput, Labeled} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import {FetchUsers} from './connectionUtils';
import LocationSearchInput from './LocationSearchInput';
import SearchBar from './SearchBar';
import { Field } from 'redux-form';

const PatientFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
            <SelectInput optionText="name" />
        </ReferenceInput>
    </Filter>
);

export const PatientList = (props) => (
    <List {...props} title="List of patients">
        <Datagrid>
            <TextField source="id" />
            <TextField source="firstName" />
            <TextField source="lastName" />
            <TextField source="primaryContact" />
            <TextField source="address.streetAddress" />
            <EditButton />
        </Datagrid>
    </List>
);

const PatientTitle = ({ record }) => {
    return <span>Patient {record ? `"${record.title}"` : ''}</span>;
};

export const PatientEdit = (props) => (
    <Edit title="Edit Patient" {...props}>
        <SimpleForm>
                        <Labeled label="Basic Details"  />
                        <TextInput source="firstName" />
                        <TextInput source="lastName"  />
                        <TextInput source="primaryContact"  />
                        <TextInput source="secondaryContact"  />
                        <Labeled label="Address Details"  />
                        <TextInput source="apartment_no" />
                        <Labeled label="Street Address"  />
                        <Field source="address" name="address" component={SearchBar} />

                </SimpleForm>
    </Edit>
);

const styles = {
    inlineBlock: { display: 'inline-flex', marginRight: '1rem' },
    textStyle: { fontSize: 26, color: 'black',
    fontWeight: 'bold'}
};

export const PatientCreate = withStyles(styles)(({ classes, ...props }) => (
    <Create {...props} title="Create Patient">
    <SimpleForm>
            <TextInput source="first_name" formClassName={classes.inlineBlock} />
            <TextInput source="last_name" formClassName={classes.inlineBlock} />
            <TextInput source="primary_contact" formClassName={classes.inlineBlock} />
            <TextInput source="secondary_contact" formClassName={classes.inlineBlock} />
            <TextInput source="house_number" />
            <Labeled label="Street Address" formClassName={classes.textStyle} />
            <LocationSearchInput source="address"/>

    </SimpleForm>

    </Create>
));