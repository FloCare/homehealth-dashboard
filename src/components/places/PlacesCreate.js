import React, {Component} from 'react';
import {
    SimpleForm, TextInput, ReferenceArrayInput, SelectArrayInput,
    required, crudUpdate, crudCreate, DisabledInput, ReferenceInput, SelectInput, LongTextInput, AutocompleteInput
} from 'react-admin';
import { withStyles } from '@material-ui/core/styles';
import {Field} from 'redux-form';
import SearchBar from '../SearchBar';
import {startUndoable as startUndoableAction} from 'ra-core';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';

const styles = theme => ({
  inlineBlock: { display: 'inline-flex', marginRight: '2rem' },
});

const validatePlacesCreation = (values) => {
    const errors = {};
    if (!values.name) {
        errors.name = ['Required'];
    }
    const contactNumber = values.contactNumber;
    if (contactNumber &&  isNaN(contactNumber)) {
        errors.contactNumber = ['Contact Number can only contain numerics'];
    }
    else if (contactNumber && contactNumber.length < 10) {
        errors.contactNumber = ['Contact Number too short'];
    }
    else if (contactNumber && contactNumber.length > 10) {
        errors.contactNumber = ['Contact Number too long'];
    }
    return errors
};

class CreateForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            updatedFields: [],
            expanded: null
        };
    }

    componentDidMount() {
        ReactGA.initialize('UA-123730827-1');
        ReactGA.pageview('/place/create');
    }

    render() {
        const { classes } = this.props;
        const { expanded } = this.state;

        return (
            <SimpleForm {...this.props} validate={validatePlacesCreation} redirect="list" >
                <TextInput source="name" label="Name" onChange={this.onChange} formClassName={classes.inlineBlock}/>
                <TextInput source="contactNumber" label="Phone Number (Optional)" onChange={this.onChange} formClassName={classes.inlineBlock}/>
                <Field source="actualAddress" name="address" component={SearchBar} onChange={this.onChange} />
            </SimpleForm>
        );
    }
}

CreateForm.propTypes = {
    startUndoable: PropTypes.func,
};

CreateForm = withStyles(styles)(CreateForm);

export default connect(null, {
    startUndoable: startUndoableAction,
})(CreateForm);
