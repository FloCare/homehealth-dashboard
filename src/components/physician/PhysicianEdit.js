import React from 'react'
import {Edit, DisabledInput, ReferenceArrayInput, SimpleForm, SelectArrayInput,
    ChipField, ArrayInput, SimpleFormIterator, TextInput, CardActions,
    ListButton, RefreshButton, Toolbar, SaveButton
} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';

const Heading = props => {
  const {text} = props
  return (
    <div>
      <h4>{text}</h4>
    </div>
  )
}

const validatePhysicianCreation = (values) => {
    const errors = {};
    if (!values.name) {
        errors.name = ['Required'];
    }
    const contactNumber = values.phone2;
    if (contactNumber &&  isNaN(contactNumber)) {
        errors.phone2 = ['Contact Number can only contain numerics'];
    }
    else if (contactNumber && contactNumber.length < 10) {
        errors.phone2 = ['Contact Number too short'];
    }
    else if (contactNumber && contactNumber.length > 10) {
        errors.phone2 = ['Contact Number too long'];
    }
    return errors
};

const styles = {
  inlineBlock: { display: 'inline-flex', alignItems: 'center' },
  inlineElementStyle: { marginRight: 20 },
    button: {
        // This is JSS syntax to target a deeper element using css selector, here the svg icon for this button
        '& svg': { color: '#64CCC9' },
        color: '#64CCC9',
        backgroundColor: 'transparent'
    },
}

export class PhysicianEdit extends React.Component {
  render () {
    const props = {...this.props}
      const PhysicianEditActions = withStyles(styles)(({ basePath, classes, resource }) => (
          <CardActions>
              <ListButton className={classes.button} basePath={basePath} />
              <RefreshButton className={classes.button}/>
          </CardActions>
      ));
      const PhysicianEditToolbar = withStyles(styles)(({ classes, ...props }) => (
          <Toolbar {...props}>
              <SaveButton
                  className={classes.button}
                  label="Save"
                  redirect="show"
                  submitOnEnter={true}
              />
          </Toolbar>
      ));
    return (
      <Edit
        {...props}
        title="Edit Physician"
        actions={<PhysicianEditActions />}
      >
        <SimpleForm validate={validatePhysicianCreation} toolbar={<PhysicianEditToolbar/>}>
          <div style={styles.inlineBlock}>
            <DisabledInput source="npi" label="NPI Id" style={styles.inlineElementStyle}/>
          </div>
          <div>
            <div style={styles.inlineBlock}>
              <DisabledInput source="firstName" style={styles.inlineElementStyle}/>
              <DisabledInput source="lastName" label="Last Name"/>
            </div>
            <div style={styles.inlineBlock}>
              <DisabledInput source="phone1" label="Phone No" style={styles.inlineElementStyle}/>
              <DisabledInput source="fax" label="Fax No" style={styles.inlineElementStyle}/>
              <TextInput source="phone2" label="Phone2 (Optional)" />
            </div>
          </div>
        </SimpleForm>
      </Edit>
    )
  }
}
