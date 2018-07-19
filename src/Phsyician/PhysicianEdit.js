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

const styles = {
  inlineBlock: { display: 'inline-flex', alignItems: 'center' },
  inlineElementStyle: { marginRight: 20 }
}

export default class PhysicianEdit extends React.Component {
  render () {
    const props = {...this.props}
    return (
      <Edit
        {...props}
        title="Edit Physician"
      >
        <SimpleForm>
          <Heading text="Edit Physician" />

          <div style={styles.inlineBlock}>
            <DisabledInput source="npiID" label="NPI Id" style={styles.inlineElementStyle}/>
          </div>
          <div>
            <div style={styles.inlineBlock}>
              <DisabledInput source="firstName" style={styles.inlineElementStyle}/>
              <DisabledInput source="lastName" label="Last Name"/>
            </div>
            <div style={styles.inlineBlock}>
              <DisabledInput source="phone1" label="Phone No" style={styles.inlineElementStyle}/>
              <DisabledInput source="faxNo" label="Fax No" style={styles.inlineElementStyle}/>
              <TextInput source="phone2" label="Alternate Phone no" />
            </div>
          </div>
        </SimpleForm>
      </Edit>
    )
  }
}
