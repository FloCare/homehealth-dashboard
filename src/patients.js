import React from 'react';
import { List, Edit, Create, Datagrid, ReferenceField, TextField, EditButton, DisabledInput, 
	LongTextInput, ReferenceInput, SelectInput, SimpleForm, TextInput, Filter, TabbedForm, FormTab, SelectArrayInput, Labeled} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import {FetchUsers} from './connectionUtils';
import LocationSearchInput from './LocationSearchInput';

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
            <TextField source="name" />
            <TextField source="primary_contact" />
            <TextField source="secondary_contact" />
            <EditButton />
        </Datagrid>
    </List>
);

const PatientTitle = ({ record }) => {
    return <span>Patient {record ? `"${record.title}"` : ''}</span>;
};

export const PatientEdit = (props) => (
    <Edit title="Edit Patient" {...props}>
<TabbedForm>
            <FormTab label="details">
                <TextInput source="id" />
                <TextInput source="name" />
                <TextInput source="primary_contact" />
                <TextInput source="secondary_contact" />
            </FormTab>
            <FormTab label="address">
                <TextInput source="id" />
                <TextInput source="name" />
                <TextInput source="primary_contact" />
                <TextInput source="secondary_contact" />
            </FormTab>
            <FormTab label="users">
                <TextInput source="id" />
                <TextInput source="name" />
                <TextInput source="primary_contact" />
                <TextInput source="secondary_contact" />
            </FormTab>
        </TabbedForm>
    </Edit>
);

const styles = {
    inlineBlock: { display: 'inline-flex', marginRight: '1rem' },
    textStyle: { fontSize: 26, color: 'black',
    fontWeight: 'bold'}
};

const choices = [
                    { id: 'music', name: 'Music' },
                    { id: 'photography', name: 'Photo' },
                    { id: 'programming', name: 'Code' },
                    { id: 'tech', name: 'Technology' },
                    { id: 'sport', name: 'Sport' },
                    { id: 'music', name: 'Music' },
                    { id: 'photography', name: 'Photo' },
                    { id: 'programming', name: 'Code' },
                    { id: 'tech', name: 'Technology' },
                    { id: 'sport', name: 'Sport' },
                    { id: 'music', name: 'Music' },
                    { id: 'photography', name: 'Photo' },
                    { id: 'programming', name: 'Code' },
                    { id: 'tech', name: 'Technology' },
                    { id: 'sport', name: 'Sport' },
                    { id: 'music', name: 'Music' },
                    { id: 'photography', name: 'Photo' },
                    { id: 'programming', name: 'Code' },
                    { id: 'tech', name: 'Technology' },
                    { id: 'sport', name: 'Sport' },
                    { id: 'music', name: 'Music' },
                    { id: 'photography', name: 'Photo' },
                    { id: 'programming', name: 'Code' },
                    { id: 'tech', name: 'Technology' },
                    { id: 'sport', name: 'Sport' },
                    { id: 'music', name: 'Music' },
                    { id: 'photography', name: 'Photo' },
                    { id: 'programming', name: 'Code' },
                    { id: 'tech', name: 'Technology' },
                    { id: 'sport', name: 'Sport' },
                ];

export const PatientCreate = withStyles(styles)(({ classes, ...props }) => (
    <Create {...props} title="Create Patient">
    <SimpleForm>
            <TextInput source="first_name" formClassName={classes.inlineBlock} />
            <TextInput source="last_name" formClassName={classes.inlineBlock} />
            <TextInput source="primary_contact" formClassName={classes.inlineBlock} />
            <TextInput source="secondary_contact" formClassName={classes.inlineBlock} />
            <SelectArrayInput label="Users" source="users" choices={choices} />
            <TextInput source="house_number" />
            <Labeled label="Street Address" formClassName={classes.textStyle} />
            <LocationSearchInput source="address"/>

    </SimpleForm>

    </Create>
));