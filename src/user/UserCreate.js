import React from 'react'
import {Create, DisabledInput, SimpleForm, TextInput, SaveButton, Toolbar, SelectInput, BooleanInput } from 'react-admin'
import { withStyles } from '@material-ui/core/styles';
import {startUndoable as startUndoableAction} from 'ra-core';
import SimpleButton from '../components/common/Button';
import Button from '@material-ui/core/Button';
import {connect} from "react-redux";
import PropTypes from "prop-types";

const Heading = props => {
  const {text} = props
  return (
    <div>
      <h4>{text}</h4>
    </div>
  )
}

const styles = {
    inlineBlock: { display: 'inline-flex', marginRight: '2rem'},
    inlineBlock1: {width: '200%'},
    inlineElementStyle: {marginLeft: 20, width: '9.5%'},
    inlineElementStyle1: {width: '9.5%'},
}

const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

const validateUserCreation = (values) => {
    const errors = {};
    const email = values.email;
    const primaryContact = values.contact_no;
    if (!values.first_name) {
        errors.first_name = ['Required'];
    }
    if (!values.last_name) {
        errors.last_name = ['Required'];
    }
    if (!values.password) {
        errors.password = ['Required'];
    }
    if (!values.user_role) {
        errors.user_role = ['Required'];
    }
    if (!email) {
        errors.email = ['Required'];
    }
    if(validateEmail(email) === false) {
        errors.email = ['Enter a valid email'];
    }
    if (!primaryContact) {
        errors.contact_no = ['Required'];
    }
    if (!primaryContact ||  isNaN(primaryContact)) {
        errors.contact_no = ['Phone Number can only contain numerics'];
    }
    else if (!primaryContact || primaryContact.length < 10) {
        errors.contact_no = ['Phone Number incomplete'];
    }

    return errors
};

class UserCreate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      password: '',
      first_name: '',
      last_name: '',
      user_role: '',
      contact_no: '',
      email: '',
      is_active: ''
    }
    this.onChange = this.onChange.bind(this);
  }

  randomPassword(length) {
      var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
      var pass = "";
      for (var x = 0; x < length; x++) {
          var i = Math.floor(Math.random() * chars.length);
          pass += chars.charAt(i);
      }
      return pass;
  }

    generatePassword(event) {
        event.preventDefault()
        var pass = this.randomPassword(6);
        this.setState({
            password: pass,
        })
    }

    onChange(e, newValue, previousValue, name) {
        this.setState({[name]: newValue});
    }

  render () {
      const { classes } = this.props;
      const props = {...this.props}
      const UserCreateToolbar = props => (
        <Toolbar {...props}>
          <SaveButton
            hidden={true}
            disabled={this.state.saveDisabled}
          />
        </Toolbar>
      )

      let userData = {}
      userData = {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        user_role: this.state.user_role,
        contact_no: this.state.contact_no,
        is_active: this.state.is_active,
        password: this.state.password,
      }
      return (
          <Create {...props} record={userData} title="Add Staff">
            <SimpleForm toolbar={<UserCreateToolbar/>} redirect="list" validate={validateUserCreation}>
                <TextInput label="First Name" source="first_name" onChange={this.onChange} formClassName={classes.inlineBlock}/>
                <TextInput label="Last Name" source="last_name" onChange={this.onChange} formClassName={classes.inlineBlock}/>
                <div style={styles.inlineBlock1}>
                    <TextInput label="Phone Number" source="contact_no" onChange={this.onChange} style={styles.inlineElementStyle1}/>
                    <SelectInput source="user_role" label="User Role" choices={[
                        { id: 'LPN', name: 'LPN' },
                        { id: 'PTA', name: 'PTA' },
                        { id: 'RN', name: 'RN' },
                        { id: 'OTR', name: 'OTR' },
                        { id: 'MS,CCC-SLP', name: 'MS,CCC-SLP' },
                        { id: 'PT, DPT', name: 'PT, DPT' },
                        { id: 'RN, MSN', name: 'RN, MSN' },
                        { id: 'RN, BSN', name: 'RN, BSN' },
                        { id: 'LMSW', name: 'LMSW' },
                        { id: 'COTA', name: 'COTA' },
                        { id: 'OT', name: 'OT' },
                        { id: 'BSW', name: 'BSW' },
                    ]} style={styles.inlineElementStyle} onChange={this.onChange}/>
                </div>
                <Heading text="App credentials"/>
                  <TextInput source="email" label="Organization Email" onChange={this.onChange} formClassName={classes.inlineBlock}/>
                  <TextInput source="password" label="Password" formClassName={classes.inlineBlock}/>
                <SimpleButton text={'Generate Password'}
                              onClick={(event) => { this.generatePassword(event) }}
                              formClassName={classes.inlineBlock}
                />
                <Button onClick={(event) => { this.generatePassword(event) }}
                        formClassName={classes.inlineBlock}>Generate Password</Button>
            </SimpleForm>
          </Create>
      )
  }
}

UserCreate.propTypes = {
    startUndoable: PropTypes.func,
};

UserCreate = withStyles(styles)(UserCreate);

export default connect(null, {
    startUndoable: startUndoableAction,
})(UserCreate);
