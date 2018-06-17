import React from 'react';
import {Edit, DisabledInput, ReferenceArrayInput, SimpleForm, SelectArrayInput, ChipField, ArrayInput, SimpleFormIterator, TextInput} from 'react-admin';

const Heading = props => {
    const {text} = props;
    return (
        <div>
            <h4>{text}</h4>
        </div>
    );
};

class PatientEdit extends React.Component {
    render() {
        const props = {...this.props};
        // console.log('Props:',props);
        return (
            <Edit
                {...props}
                title="Edit Patient"
            >
                <SimpleForm>
                    <Heading text="Basic Details" />
                    <DisabledInput source="firstName" />
                    <DisabledInput source="lastName" />
                    <DisabledInput source="primaryContact" />
                    <DisabledInput source="address" />
                    <Heading text="Care Givers"/>
                    <ReferenceArrayInput label="Users" source="users" reference="users">
                        <SelectArrayInput optionText="username" />
                    </ReferenceArrayInput>
                </SimpleForm>
            </Edit>
        );
    }
}

export default PatientEdit;
