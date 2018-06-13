import React from 'react';
import { List, Edit, Create, Datagrid, ReferenceField, TextField, EditButton, DisabledInput, 
    LongTextInput, ReferenceInput, SelectInput, SimpleForm, TextInput, Filter, TabbedForm, FormTab, SelectArrayInput, Labeled} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import {FetchUsers} from './connectionUtils';
import LocationSearchInput from './LocationSearchInput';

class PatientCreate extends React.Component {
    constructor(props) {
        super(props);
    }
    state = { users: [] };

     componentWillMount() {
        this.fetchUsers();
    }

    async fetchUsers() {
        const res = await fetch('http://app-9707.on-aptible.com/users/v1.0/view?format=json').then((resp) => {
            return resp.json();
        }).then((resp) => {
            console.log(resp[0]);
            var list = [];
            list.push({ id: '2', name: 'helo' });
            console.log(list);
            this.setState({ 
                users: [...this.state.users, ...list]
            });
            return resp;
        });
    }

    render(props) {
        return (
            <Create location={this.props.location}
            match={this.props.match}
            resource={this.props.resource}
            title="Create Patient">
                <SimpleForm>
                        <TextInput source="first_name"  />
                        <TextInput source="last_name"  />
                        <TextInput source="primary_contact"  />
                        <TextInput source="secondary_contact"  />
                        <SelectArrayInput label="Users" source="users" choices={this.state.users} />
                        <TextInput source="house_number" />
                        <Labeled label="Street Address"  />
                        <LocationSearchInput source="address"/>

                </SimpleForm>
    </Create>
        );
    }
}

export default PatientCreate;
