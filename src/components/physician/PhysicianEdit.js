import React from 'react'
import {Edit, DisabledInput, ReferenceArrayInput, SimpleForm, SelectArrayInput, ChipField, ArrayInput, SimpleFormIterator, TextInput
} from 'react-admin'

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
  inlineElementStyle: { marginRight: 20 }
}

export class PhysicianEdit extends React.Component {
  render () {
    const props = {...this.props}
    return (
      <Edit
        {...props}
        title="Edit Physician"
      >
        <SimpleForm validate={validatePhysicianCreation}>
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
