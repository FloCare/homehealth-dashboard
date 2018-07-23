import React, {Component} from 'react';
import {
    SimpleForm, TextInput, ReferenceArrayInput, SelectArrayInput,
    required, crudUpdate, crudCreate, DisabledInput, ReferenceInput, SelectInput
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
    width: '100%'
  },
  root: {
    width: '100%',
    marginTop: '2%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  inlineBlock: { display: 'inline-flex', marginRight: '1rem' },
});

const Heading = props => {
    const {text} = props;
    return (
        <div>
            <h4>{text}</h4>
        </div>
    );
};

class CreateForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            updatedFields: [],
            expanded: null
        };
    }

      handleChange = panel => (event, expanded) => {
        this.setState({
          expanded: expanded ? panel : false,
        });
      };


    // Todo: Pass only relevant props to SimpleForm (Find out how Edit component does this)
    // Todo: Shouldn't have to pass onChange to each field
    render() {
        const { classes } = this.props;
        const { expanded } = this.state;
        return (
            <SimpleForm {...this.props} redirect="list" >
                <Heading text="Basic Details"/>
                <TextInput source="firstName"  validate={required()} onChange={this.onChange} formClassName={classes.inlineBlock}/>
                <TextInput source="lastName"  validate={required()} onChange={this.onChange} formClassName={classes.inlineBlock}/>
                <Field source="actualAddress" name="address" component={SearchBar} onChange={this.onChange}/>
                <TextInput source="apartment_no" label="Apt #, suite, unit, floor (Optional)" styles={{marginBottom: 10}} onChange={this.onChange} />
                <TextInput source="primaryContact" label="Phone Number" validate={required()} onChange={this.onChange} />
                <DateInput source="dateOfBirth"  label="DOB (mm-dd-yyyy)(Optional)" 
                     options={{ format: 'MM-DD-YYYY', maxDate: '01-01-2018', openToYearSelection: true, disableFuture: true, clearable: true, keyboard: true, mask: [/[0-1]/, /[1-9]/, '-', /[0-3]/, /[0-9]/, '-', /[1-2]/, /\d/, /\d/, /\d/] }}
                     onChange={this.onChange} />
                <div className={classes.root} >
                    <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Emergency Contact Details (Optional)</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <TextInput source="emergencyContactName" label="Contact Name" onChange={this.onChange} className={classes.inlineBlock} />
                        <TextInput source="emergencyContactNumber" label="Contact Number" onChange={this.onChange} className={classes.inlineBlock} />
                        <TextInput source="emergencyContactRelationship" label="Relationship" onChange={this.onChange} />
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                </div>
                <div className={classes.accordian} >
                    <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Care Team</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <ReferenceArrayInput {...this.props} label="Staff" source="users" reference="users">
                            <SelectArrayInput optionText="displayname" optionValue="id" />
                        </ReferenceArrayInput>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                </div>
                <div className={classes.accordian} >
                    <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Physician Team</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <ReferenceInput label="Primary Physician" {...this.props} source="physician_id" reference="physicians">
                            <SelectInput optionText="first_name" optionValue="id" />
                        </ReferenceInput>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                </div>
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
