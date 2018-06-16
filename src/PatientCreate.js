import React from 'react';
import { Create, SimpleForm, TextInput, SelectArrayInput, Labeled} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import {FetchUsers} from './connectionUtils';
import SearchBar from './SearchBar';
import { Field } from 'redux-form';

const styles = {
    main: {
        marginTop: 48,
        padding: 10,
    },
    foo: {
        margin: 0,
    },
};

class PatientCreate extends React.Component<classes> {
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
        const request = new Request('http://app-9707.on-aptible.com/users/v1.0/org-access/?format=json', {
            headers: new Headers({ 'Authorization': 'Token '+ localStorage.getItem('access_token')
            }),
        })
        const res = await fetch(request).then((resp) => {
            return resp.json();
        }).then((resp) => {
            var list = [];
            var users = resp.users;
            for (var i = 0; i < users.length; i++) {
                list.push({ id: users[i].id, name: users[i].username });
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
            if (!values.address) {
                errors.apartment_no = ['The street address has to be selected from the dropdown'];
            }
            return errors
        };
        return (
            <Create location={this.props.location}
            match={this.props.match}
            resource={this.props.resource}
            title="Create Patient">
                <SimpleForm validate={validateUserCreation}>
                        <h4> Basic Details </h4>
                        <TextInput source="firstName" formClassName={{display: 'inline-flex', fontSize: 34, color: 'black', fontWeight: 'bold'}} />
                        <TextInput source="lastName"  formClassName={{display: 'inline-flex', fontSize: 34, color: 'black', fontWeight: 'bold'}}/>
                        <TextInput source="primaryContact"  />
                        <h4> Address Details </h4>
                        <Field source="address" name="address" component={SearchBar} />
                        <TextInput source="apartment_no" />
                        <h4> Care Givers </h4>
                        <SelectArrayInput label="Users" source="users" choices={this.state.users}/>
                </SimpleForm>
            </Create>
        );
    }
}

export default PatientCreate;
