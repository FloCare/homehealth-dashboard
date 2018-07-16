import React from 'react';
import {List, Datagrid, TextField, EditButton} from 'react-admin';
import {Create, Edit, SimpleForm, TextInput, SelectArrayInput, ReferenceArrayInput, LongTextInput, TabbedForm, FormTab, DisabledInput,
            ReferenceArrayField, SingleFieldList, ChipField, DateInput} from 'react-admin';
import SearchBar from './SearchBar';
import {Field} from 'redux-form';
import withStyles from '@material-ui/core/styles/withStyles';

const PhysicianPagination = () => {
    return (
        false
    );
}

export const PhysicianList = (props) => (
    <List {...props} title="List of physicians" pagination={<PhysicianPagination />}>
        <Datagrid>
            <TextField source="np1" />
            <TextField source="first_name" />
            <TextField source="last_name" />
            <TextField source="phone1" />
            <EditButton />
        </Datagrid>
    </List>
);


const validatePhysicianCreation = (values) => {
    const errors = {};
    if (!values.firstName) {
        errors.firstName = ['Required'];
    }
    if (!values.lastName) {
        errors.lastName = ['Required'];
    }
    return errors
};

const Heading = props => {
    const {text} = props;
    return (
        <div>
            <h4>{text}</h4>
        </div>
    );
};

const Info = props => {
    const {text, style, textColor} = props;
    return (
        <div style={style}>
            <font size="2" color={textColor}>{text}</font>
        </div>
    );
};

const styles = {
    inlineBlock: { display: 'inline-flex', marginRight: '1rem' },
    textStyle: { fontSize: 34, color: 'black', fontWeight: 'bold'}
};



export const PhysicianEdit = withStyles(styles)(({ classes, ...props, ...rest }) => (
    <Edit title="Edit Physician" {...props}>
        <SimpleForm>
            <Heading text="Basic Details"/>
            <DisabledInput source="firstName" formClassName={classes.inlineBlock} />
            <DisabledInput source="lastName" formClassName={classes.inlineBlock} />
            <DisabledInput source="primaryContact" label="Phone Number"  formClassName={classes.inlineBlock}/>
        </SimpleForm>
    </Edit>
));


export const PhysicianCreate = withStyles(styles)(({ classes, ...props }) => (
    <Create {...props} title="Create Physician">
        <SimpleForm validate={validatePhysicianCreation} redirect="list">
            <Heading text="Basic Details"/>
            <TextInput source="npi" label="NPI Id" />
            <TextInput source="firstName" formClassName={classes.inlineBlock} />
            <TextInput source="lastName" formClassName={classes.inlineBlock} />
            <TextInput source="phone1" label="Primary Phone Number" />
            <TextInput source="phone2" label="Secondary Phone Number" formClassName={classes.inlineBlock}/>
            <TextInput source="fax" label="Fax" />
        </SimpleForm>
    </Create>
));