import React, {Component} from 'react';
import {
    SimpleForm, TextInput, ReferenceArrayInput, SelectArrayInput,
    required, crudUpdate, DisabledInput
} from 'react-admin';
import {startUndoable as startUndoableAction} from 'ra-core';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
// import SearchBar from './SearchBar';
// import {Field} from 'redux-form';

const Heading = props => {
    const {text} = props;
    return (
        <div>
            <h4>{text}</h4>
        </div>
    );
};

class EditForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            updatedFields: []
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getBasePath = this.getBasePath.bind(this);
    }

    getBasePath() {
        const { location } = this.props;
        return location.pathname
            .split('/')
            .slice(0, -1)
            .join('/');
    }

    onChange(e, newValue, previousValue, name) {
        const updatedFields = this.state.updatedFields.slice(0);
        if (updatedFields.indexOf(name) > -1) {
            return;
        }
        updatedFields.push(name);
        // Mark all address fields dirty
        // if (name === 'streetAddress') {
        //     updatedFields.push('latitude', 'longitude');
        // }
        this.setState({updatedFields: updatedFields});
    }

    onSubmit(data, redirect){
        const {startUndoable} = this.props;

        data.updatedFields = this.state.updatedFields;

        startUndoable(
            crudUpdate(
                this.props.resource,
                this.props.record.id,
                data,
                this.props.record,
                this.getBasePath(),
                redirect
            )
        );
    }

    // Todo: Pass only relevant props to SimpleForm (Find out how Edit component does this)
    // Todo: Shouldn't have to pass onChange to each field
    render() {
        return (
            <SimpleForm {...this.props} save={this.onSubmit}>
                <Heading text="Basic Details"/>
                <TextInput source="firstName"  validate={required()} onChange={this.onChange} />
                <TextInput source="lastName"  validate={required()} onChange={this.onChange} />
                <TextInput source="primaryContact" label="Phone Number" validate={required()} onChange={this.onChange} />
                <Heading text="Emergency Contact Details"/>
                <TextInput source="emergencyContactName" onChange={this.onChange} />
                <TextInput source="emergencyContactNumber" onChange={this.onChange}/>
                <TextInput source="emergencyContactRelationship" label="Relationship" onChange={this.onChange}/>
                <Heading text="Address Details" />
                <DisabledInput source="streetAddress"  validate={required()} onChange={this.onChange} />
                {/*<Field source="streetAddress" name="address" component={SearchBar} />*/}
                <DisabledInput source="apartmentNo" label="Apt #, suite, unit, floor (Optional)" styles={{marginBottom: 10}} onChange={this.onChange} />
                <Heading text="Care Team" />
                <ReferenceArrayInput label="Staff" source="userIds" reference="users">
                    <SelectArrayInput optionText="displayname" optionValue="id" />
                </ReferenceArrayInput>
            </SimpleForm>
        );
    }
}

// function mapStateToProps(state, props) {
//     return {
//         id: decodeURIComponent(props.match.params.id),
//         record: state.admin.resources[props.resource]
//             ? state.admin.resources[props.resource].data[
//                   decodeURIComponent(props.match.params.id)
//               ]
//             : null,
//     };
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         destroyTodo: () =>
//             dispatch({
//                 type: 'DESTROY_TODO'
//             })
//     }
// };

EditForm.propTypes = {
    startUndoable: PropTypes.func,
};

export default connect(null, {
    startUndoable: startUndoableAction,
})(EditForm);
