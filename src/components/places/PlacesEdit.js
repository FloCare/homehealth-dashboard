import React, {Component} from 'react';
import {
    SimpleForm, TextInput, ReferenceArrayInput, SelectArrayInput,
    required, crudUpdate, DisabledInput, ReferenceInput, SelectInput, LongTextInput, AutocompleteInput
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

class EditForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            updatedFields: [],
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getBasePath = this.getBasePath.bind(this);
    }

    componentDidMount() {
        ReactGA.initialize('UA-123730827-1');
        ReactGA.pageview('/stop/edit');
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

      handleChange = panel => (event, expanded) => {
        this.setState({
          expanded: expanded ? panel : false,
        });
      };

    onSubmit(data, redirect){
        console.log(data);
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

    render() {
        const { classes } = this.props;
        return (
            <SimpleForm {...this.props} validate={validatePlacesCreation} save={this.onSubmit}>
                <TextInput source="name"  onChange={this.onChange} formClassName={classes.inlineBlock}/>
                <TextInput source="contactNumber" label="Phone Number (Optional)" onChange={this.onChange} formClassName={classes.inlineBlock}/>
                <Field source="actualAddress" name="address" component={SearchBar} onChange={this.onChange}/>
            </SimpleForm>
        );
    }
}


EditForm.propTypes = {
    startUndoable: PropTypes.func,
};

EditForm = withStyles(styles)(EditForm);

export default connect(null, {
    startUndoable: startUndoableAction,
})(EditForm);
