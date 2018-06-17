import React from 'react';
import {List, Datagrid, TextField, EditButton} from 'react-admin';
import {Create, SimpleForm, TextInput, SelectArrayInput, ReferenceArrayInput, LongTextInput, TabbedForm, FormTab} from 'react-admin';
import SearchBar from './SearchBar';
import {Field} from 'redux-form';
import withStyles from '@material-ui/core/styles/withStyles';
// import {FetchUsers} from './connectionUtils';
// import LocationSearchInput from './LocationSearchInput';
// import SearchBar from './SearchBar';
// import { Field } from 'redux-form';

export const PatientList = (props) => (
    <List {...props} title="List of patients">
        <Datagrid>
            <TextField source="id" />
            <TextField source="firstName" />
            <TextField source="lastName" />
            <TextField source="primaryContact" />
            <EditButton />
        </Datagrid>
    </List>
);

// const PatientFilter = (props) => (
//     <Filter {...props}>
//         <TextInput label="Search" source="q" alwaysOn />
//         <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
//             <SelectInput optionText="name" />
//         </ReferenceInput>
//     </Filter>
// );

// const PatientTitle = ({ record }) => {
//     return <span>Patient {record ? `"${record.title}"` : ''}</span>;
// };

const validatePatientCreation = (values) => {
    const errors = {};
    if (!values.firstName) {
        errors.firstName = ['Required'];
    }
    if (!values.lastName) {
        errors.lastName = ['Required'];
    }
    if (!values.address || values.address.length < 6) {
        errors.address = ['The street address has to be selected from the dropdown'];
    }
    const primaryContact = values.primaryContact;
    if (!values.primaryContact) {
        errors.primaryContact = ['Required'];
    }
    else if (!primaryContact ||  isNaN(primaryContact)) {
        errors.primaryContact = ['Contact Number can only contain numerics'];
    }
    else if (!primaryContact || primaryContact.length < 10) {
        errors.primaryContact = ['Contact Number incomplete'];
    }
    else if (!primaryContact || primaryContact.length > 10) {
        errors.primaryContact = ['Contact Number too long'];
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

const styles = {
    inlineBlock: { display: 'inline-flex', marginRight: '1rem' },
    textStyle: { fontSize: 34, color: 'black', fontWeight: 'bold'}
};

// export const PatientEdit = withStyles(styles)(({ classes, ...props, ...rest }) => (
//     <Edit title="Edit Patient" {...props}>
//         <SimpleForm>
//                         <Labeled label="Basic Details" formClassName={classes.textStyle} />
//                         <DisabledInput source="firstName" />
//                         <DisabledInput source="lastName"  />
//                         <DisabledInput source="primaryContact"  />
//                         <DisabledInput source="secondaryContact"  />
//                         <Labeled label="Caregivers" formClassName={classes.textStyle} />
//                         <SelectArrayInput label="Users" source="users" choices={[
//                                     { id: '1', name: 'pymd' },
//                                     { id: '2', name: 'harshal' }
//                                 ]}/>
//                 </SimpleForm>
//     </Edit>
// ));
//
//
export const PatientCreate = withStyles(styles)(({ classes, ...props }) => (
    <Create {...props} title="Create Patient">
    <SimpleForm validate={validatePatientCreation}>
                    <Heading text="Basic Details"/>
                    <TextInput source="firstName" formClassName={classes.inlineBlock} />
                    <TextInput source="lastName" formClassName={classes.inlineBlock} />
                    <TextInput source="primaryContact" label="Phone Number" />
                    <Heading text="Address Details"/>
                    <TextInput source="apartment_no" label="Apartment, suite, unit, floor etc" styles={{marginBottom: 10}}/>
                    <div style={{width: '100%', marginTop: 30, marginBottom: 10}}>
                        <font size="2" color="black">Street Address</font>
                    </div>
                    <Field source="address" name="address" component={SearchBar} />
                    <Heading text="Care Team"/>
                    <ReferenceArrayInput label="Staff" source="users" reference="users">
                        <SelectArrayInput optionText="username" optionValue="id" />
                    </ReferenceArrayInput>
                    <div style={{width: '100%', marginTop: 30}}>
                        <font size="2" color="black">Note: Do select the street address from the suggestions</font>
                    </div>

    </SimpleForm>

    </Create>
));