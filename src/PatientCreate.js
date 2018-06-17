import React, {Component} from 'react';
import {Create, SimpleForm, TextInput, SelectArrayInput, ReferenceArrayInput} from 'react-admin';
import SearchBar from './SearchBar';
import {Field} from 'redux-form';

// const required = (message = 'Required') =>
//     value => value ? undefined : message;
// const maxLength = (max, message = 'Too short') =>
//     value => value && value.length < max ? message : undefined;
// const number = (message = 'Must be a number') =>
//     value => value && isNaN(Number(value)) ? message : undefined;
// const minValue = (min, message = 'Too small') =>
//     value => value && value < min ? message : undefined;
// const phoneLength = (max, message = 'Phone number should be of size 10') =>
//     value => value && value.length < max ? message : undefined;

// const phoneNumberValidation = [required(), phoneLength(10)];
// const validateAddress = [required()];
// const validateFirstName = [required(), maxLength(5)];
// const validateUsers = [required(), maxLength(1)];

const validateUserCreation = (values) => {
    const errors = {};
    if (!values.firstName) {
        errors.firstName = ['FirstName is required'];
    }
    if (!values.lastName) {
        errors.lastName = ['LastName is required'];
    }
    if (!values.primaryContact) {
        errors.primaryContact = ['PrimaryContact is required'];
    }
    if (!values.address || values.address.length < 6) {
        errors.address = ['The street address has to be selected from the dropdown'];
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

class PatientCreate extends Component {
    render() {
        const props = {...this.props};
        // console.log('Props:',props);
        return (
            <Create
                {...props}
                title="Create Patient"
            >
                <SimpleForm validate={validateUserCreation}>
                    <Heading text="Basic Details"/>
                    <TextInput source="firstName" formClassName={{display: 'inline-flex', fontSize: 34, color: 'black', fontWeight: 'bold'}} />
                    <TextInput source="lastName"  formClassName={{display: 'inline-flex', fontSize: 34, color: 'black', fontWeight: 'bold'}}/>
                    <TextInput source="primaryContact"  />
                    <Heading text="Address Details"/>
                    <Field source="address" name="address" component={SearchBar} />
                    <TextInput source="apartment_no" />
                    <Heading text="Care Givers"/>
                    <ReferenceArrayInput label="Users" source="users" reference="users">
                        <SelectArrayInput optionText="username" optionValue="id" />
                    </ReferenceArrayInput>
                    <div style={{width: '100%', marginTop: 30}}>
                        <font size="2" color="red">Note: Do select the street address from the suggestions</font>
                    </div>
                </SimpleForm>
            </Create>
        );
    }
}

export default PatientCreate;
