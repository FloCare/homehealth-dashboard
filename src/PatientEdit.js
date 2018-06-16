import React from 'react';
import { List, Edit, Create, Datagrid, ReferenceField, TextField, EditButton, DisabledInput, 
    LongTextInput, ReferenceInput, SelectInput, SimpleForm, TextInput, Filter, TabbedForm, FormTab, SelectArrayInput, Labeled, ChipField} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import {FetchUsers} from './connectionUtils';
import LocationSearchInput from './LocationSearchInput';

class PatientEdit extends React.Component {
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
        return (
            <Edit location={this.props.location}
            match={this.props.match}
            resource={this.props.resource}
            title="Edit Patient">
                <SimpleForm>
                        <div>
                        <h4> Basic Details </h4>
                        </div>
                        <DisabledInput source="firstName" />
                        <DisabledInput source="lastName"  />
                        <DisabledInput source="primaryContact"  />
                        <div>
                        <h4> Care Givers </h4>
                        </div>
                        <SelectArrayInput label="Users" source="users" choices={this.state.users}>
                            <ChipField source="name" />
                        </SelectArrayInput>

                </SimpleForm>
            </Edit>
        );
    }
}

export default PatientEdit;