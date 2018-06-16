import React from 'react';
import { List, Edit, Create, Datagrid, TextField, EditButton, ReferenceInput, SelectInput, SimpleForm, 
    TextInput, Filter, TabbedForm, FormTab, SelectArrayInput, Labeled, DisabledInput} from 'react-admin';
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
            <TextField source="lastName" />
            <TextField source="primaryContact" />
            <EditButton />
        </Datagrid>
    </List>
);

const PatientTitle = ({ record }) => {
    return <span>Patient {record ? `"${record.title}"` : ''}</span>;
};

const styles = {
    inlineBlock: { display: 'inline-flex', marginRight: '1rem' },
    textStyle: { fontSize: 34, color: 'black', fontWeight: 'bold'}
};

export const PatientEdit = withStyles(styles)(({ classes, ...props, ...rest }) => (
    <Edit title="Edit Patient" {...props}>
        <SimpleForm>
                        <Labeled label="Basic Details" formClassName={classes.textStyle} />
                        <DisabledInput source="firstName" />
                        <DisabledInput source="lastName"  />
                        <DisabledInput source="primaryContact"  />
                        <DisabledInput source="secondaryContact"  />
                        <Labeled label="Caregivers" formClassName={classes.textStyle} />
                        <SelectArrayInput label="Users" source="users" choices={[
                                    { id: '1', name: 'pymd' },
                                    { id: '2', name: 'harshal' }
                                ]}/>
                </SimpleForm>
    </Edit>
));


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