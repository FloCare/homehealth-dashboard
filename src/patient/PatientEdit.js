import React, {Component} from 'react';
import {
    SimpleForm, TextInput, ReferenceArrayInput, SelectArrayInput,
    required, crudUpdate, DisabledInput, ReferenceInput, SelectInput, LongTextInput, AutocompleteInput
} from 'react-admin';
import { withStyles } from '@material-ui/core/styles';
import {Field} from 'redux-form';
import SearchBar from '../SearchBar';
import { DateInput, TimeInput, DateTimeInput } from 'react-admin-date-inputs';
import {startUndoable as startUndoableAction} from 'ra-core';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
   accordian: {
    width: '100%',
  },
  root: {
    width: '100%',
    marginTop: '2%',
  },
    root1: {
    width: '100%',
    marginTop: '2%',
    marginBottom: '8%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(14),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  inlineBlock: { display: 'inline-flex', marginRight: '2rem' },
  inlineBlock1: { display: 'inline-flex', marginRight: '1rem' },
});

const validatePatientCreation = (values) => {
    console.log('hello');
    const errors = {};
    if (!values.firstName) {
        errors.firstName = ['Required'];
    }
    if (!values.lastName) {
        errors.lastName = ['Required'];
    }
    var dateOfBirth = values.dob;
    var today = new Date().toISOString().slice(0,10); 
    if(dateOfBirth) {
        var dob = JSON.stringify(dateOfBirth);
        var dateMonthYearHifenSeparated = dob.substring(1, dob.length -1).split('T');
        var dateArray = dateMonthYearHifenSeparated[0].split('-');
        var todayDateArray = today.split('-');
        var date = parseInt(dateArray[2]);
        var month = parseInt(dateArray[1]);
        var year = parseInt(dateArray[0]);
        if(year > parseInt(todayDateArray[0])) {
            errors.dob = ['Incorrect date entered'];
        }
        else if(year == parseInt(todayDateArray[0]) && month > parseInt(todayDateArray[1])) {
            errors.dob = ['Incorrect date entered'];
        }
        else if(year == parseInt(todayDateArray[0]) && month == parseInt(todayDateArray[1]) && date >= parseInt(todayDateArray[2])) {
            errors.dob = ['Incorrect date entered'];
        }
    }
    const primaryContact = values.primaryContact;
    const emergencyContactNumber = values.emergencyContactNumber;
    if ((emergencyContactNumber && emergencyContactNumber.length > 1) && emergencyContactNumber.length < 10) {
        errors.emergencyContactNumber = ['Contact Number incomplete'];
    }
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
    if ((emergencyContactNumber && emergencyContactNumber.length > 1) && (isNaN(emergencyContactNumber))) {
        errors.emergencyContactNumber = ['Contact Number can only contain numerics'];
    }
    return errors
};

const Heading = props => {
    const {text} = props;
    return (
        <div>
            <h5>{text}</h5>
        </div>
    );
};

class EditForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            updatedFields: [],
            expanded: null
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

    // Todo: Pass only relevant props to SimpleForm (Find out how Edit component does this)
    // Todo: Shouldn't have to pass onChange to each field
    render() {
        const { classes } = this.props;
        const { expanded } = this.state;
        const suggestionRenderer = ({ suggestion, query, isHighlighted, props }) => {
            if(query.length>0) {
                return (<div style={{width: '175px', paddingLeft: '10px', marginBottom: '3px'}}>
                            <span>{suggestion.lastName} {suggestion.firstName}</span>
                        </div>)
            }
            return null;
        }
        return (
            <SimpleForm {...this.props} validate={validatePatientCreation} save={this.onSubmit}>
                <TextInput source="firstName"  onChange={this.onChange} formClassName={classes.inlineBlock}/>
                <TextInput source="lastName"  onChange={this.onChange} formClassName={classes.inlineBlock}/>
                <TextInput source="primaryContact" label="Phone Number" onChange={this.onChange} />
                <Field source="actualAddress" name="address" component={SearchBar} onChange={this.onChange} formClassName={classes.inlineBlock1}/>
                <LongTextInput source="apartmentNo" label="Apt., (Optional)" styles={{marginBottom: 10}} onChange={this.onChange} formClassName={classes.inlineBlock1}/>
                <DateInput source="dob"  label="DOB (mm-dd-yyyy)(Optional)"
                     options={{ format: 'MM-DD-YYYY', openToYearSelection: true, clearable: true, keyboard: true, mask: [/[0-1]/, /[0-9]/, '-', /[0-3]/, /[0-9]/, '-', /[1-2]/, /\d/, /\d/, /\d/] }}
                     onChange={this.onChange} />
                <Heading text="Care Team"/>
                <ReferenceArrayInput record={this.props.record} label="Staff" source="userIds" reference="users" sort={{ field: 'last_name', order: 'DESC' }}>
                    <SelectArrayInput optionText="displayname" optionValue="id" />
                </ReferenceArrayInput>
                <div className={classes.root} >
                    <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}><b>Physician Details</b> (Optional)</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <ReferenceInput label="Primary Physician" record={this.props.record} source="physician_id" reference="physicians" perPage={3}>
                            <AutocompleteInput optionText="displayname" optionValue="id" suggestionComponent={suggestionRenderer} />
                        </ReferenceInput>
                        <div className={classes.root1} />
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                </div>
                <div className={classes.accordian} >
                    <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}><b>Emergency Contact Details</b> (Optional)</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <TextInput source="emergencyContactName" label="Contact Name" onChange={this.onChange} className={classes.inlineBlock} />
                        <TextInput source="emergencyContactRelationship" label="Relationship" onChange={this.onChange} className={classes.inlineBlock} />
                        <TextInput source="emergencyContactNumber" label="Contact Number" onChange={this.onChange} />
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                </div>
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

EditForm = withStyles(styles)(EditForm);

export default connect(null, {
    startUndoable: startUndoableAction,
})(EditForm);
