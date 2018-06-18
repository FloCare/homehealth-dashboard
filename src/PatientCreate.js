import React, {Component} from 'react';
import {Create, SimpleForm, TextInput, SelectArrayInput, ReferenceArrayInput, LongTextInput,
//     CardActions,
//     ListButton,
//     ShowButton,
//     DeleteButton,
//     RefreshButton,
} from 'react-admin';
import SearchBar from './SearchBar';
import {Field} from 'redux-form';


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

// const PatientCreateActions = ({ basePath, data, resource }) => (
//     <CardActions>
//         {/*<ShowButton basePath={basePath} record={data} />*/}
//         <ListButton basePath={basePath} />
//         {/*<DeleteButton basePath={basePath} record={data} resource={resource} />*/}
//         <RefreshButton />
//         {/* Add your custom actions */}
//         {/*<Button color="primary" onClick={customAction}>Custom Action</Button>*/}
//     </CardActions>
// );

class PatientCreate extends Component {
    render() {
        const props = {...this.props};
        return (
            <Create
                {...props}
                title="Create Patient"
                // actions={<PatientCreateActions/>}
            >
                <SimpleForm
                    validate={validatePatientCreation}
                    redirect="list"
                >
                    <Heading text="Basic Details"/>
                    <LongTextInput source="firstName" style={{ width: 250, display: 'inline-block' }} />
                    <LongTextInput source="lastName"  style={{ width: 250, display: 'inline-block' }}/>
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
