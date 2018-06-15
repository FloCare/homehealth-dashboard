import React from 'react';
import { Create, SimpleForm, TextInput, SelectArrayInput, Labeled} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import {FetchUsers} from './connectionUtils';
import SearchBar from './SearchBar';
import { Field } from 'redux-form';

class PatientCreate extends React.Component {
    constructor(props) {
        super(props);
        this.handleInput=this.handleInput.bind(this); 
    }
    state = { 
                users: [],
                address: '' 
            };

    handleInput(val){
        this.setState({
            address: val
        });
    }

    componentWillMount() {
        this.fetchUsers();
    }

    async fetchUsers() {
        const res = await fetch('http://app-9707.on-aptible.com/users/v1.0/view?format=json').then((resp) => {
            return resp.json();
        }).then((resp) => {
            var list = [];
            for (var i = 0; i < resp.length; i++) {
                list.push({ id: resp[i].id, name: resp[i].username });
            }
            this.setState({ 
                users: [...this.state.users, ...list]
            });
            return resp;
        });
    }


    render(props) {
        const required = (message = 'Required') =>
            value => value ? undefined : message;
        const maxLength = (max, message = 'Too short') =>
            value => value && value.length < max ? message : undefined;
        const number = (message = 'Must be a number') =>
            value => value && isNaN(Number(value)) ? message : undefined;
        const minValue = (min, message = 'Too small') =>
            value => value && value < min ? message : undefined;
        const phoneLength = (max, message = 'Phone number should be of size 10') =>
            value => value && value.length < max ? message : undefined;

        const phoneNumberValidation = [required(), phoneLength(10)];
        const validateAddress = [required()];
        const validateFirstName = [required(), maxLength(5)];
        const validateUsers = [required(), maxLength(1)];
        return (
            <Create location={this.props.location}
            match={this.props.match}
            resource={this.props.resource}
            title="Create Patient">
                <SimpleForm>
                        <Labeled label="Basic Details"  />
                        <TextInput source="firstName" />
                        <TextInput source="lastName"  />
                        <TextInput source="primaryContact"  />
                        <TextInput source="secondaryContact"  />
                        <Labeled label="Caregivers"  />
                        <SelectArrayInput label="Users" source="users" choices={this.state.users}/>
                        <Labeled label="Address Details"  />
                        <TextInput source="apartment_no" />
                        <Labeled label="Street Address"  />
                        <Field source="address" name="address" component={SearchBar} />

                </SimpleForm>
            </Create>
        );
    }
}

export default PatientCreate;
