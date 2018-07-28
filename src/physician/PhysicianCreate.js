import React from 'react'
import {Create, DisabledInput, SimpleForm, TextInput, SaveButton, Toolbar } from 'react-admin'
import Loadable from 'react-loading-overlay'
import SimpleButton from '../components/common/Button'
import {HttpStatus} from '../HttpStatusConstants'
import {SimpleDialog} from 'rmwc/Dialog'
import {parseMobileNumber, capitalize} from '../parsingUtils'

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

export default class PhysicianCreate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      fetchedNPIData: false,
      saveDisabled: true,
      showErrorPopUp: false
    }
  }

  parseNPIData (data) {
    const address = data.addresses.find((address) => address.address_purpose === 'LOCATION');
    return {
      firstName: capitalize(data.basic.first_name),
      lastName: capitalize(data.basic.last_name),
      npiID: data.number,
      fax: address ? address.us_fax_number : null,
      phone1: address ? parseMobileNumber(address.us_telephone_number) : null
    }
  }

  fetchNPIData (event) {
    console.log('fetching NPI data for ', this.npiInput)
    event.preventDefault()
    const npiURL = 'http://npi.npi.io/npi/' + this.npiInput + '.json'
    this.setState({
      fetchedNPIData: false,
      loading: true
    })
    fetch(npiURL).then(
      (response) => {
        if (response.status === HttpStatus.OK) {
          return response.json()
        }
        throw new Error('Http Status not ok')
      }
    ).then(
      (response) => {
        console.log(response)
        this.setState({
          fetchedNPIData: true,
          loading: false,
          physicianNPIData: this.parseNPIData(response),
          saveDisabled: false
        })
      }
    ).catch(
      (error) => {
        this.setState({
          loading: false,
          saveDisabled: true,
          showErrorPopUp: true
        })
        console.log(error.stack)
      }
    )
  }

  handleNPIInputChange (event) {
    console.log('changing npi input: ' + event.currentTarget.value)
    this.npiInput = event.currentTarget.value
    this.setState({
      fetchedNPIData: false,
      loading: false,
      physicianNPIData: null,
      saveDisabled: true
    })
  }

  render () {
    const props = {...this.props}
    const PhysicianCreateToolbar = props => (
      <Toolbar {...props}>
        <SaveButton
          hidden={true}
          disabled={this.state.saveDisabled}
        />
      </Toolbar>
    )

    const fetchedNPIData = this.state.fetchedNPIData
    let physicianData = {}
    if (fetchedNPIData) {
      const {firstName, lastName, npiID, fax, phone1} = this.state.physicianNPIData
      physicianData = {
        npiID: npiID,
        firstName: firstName,
        lastName: lastName,
        phone1: phone1,
        fax: fax
      }
    }
    return (
      <Loadable active={this.state.loading}
        spinner
        text='Searching ...'
      >
        <SimpleDialog
          title="ERROR"
          body="Invalid NPI Id passed, please enter a valid NPI ID"
          open={this.state.showErrorPopUp}
          onClose={evt => this.setState({showErrorPopUp: false})}
          acceptLabel={'OK'}
          cancelLabel={null}
        />
        <Create {...props} record={physicianData} title="Add Physician">
          <SimpleForm toolbar={<PhysicianCreateToolbar/>} redirect="list">

            <div style={styles.inlineBlock}>
              <TextInput source="npiID" label="NPI Id" style={styles.inlineElementStyle}
                onChange={(event) => { this.handleNPIInputChange(event) }}
              />
              <SimpleButton text={'Search'} onClick={(event) => { this.fetchNPIData(event) }}/>
            </div>
            {
              fetchedNPIData &&
                <div>
                  <div style={styles.inlineBlock}>
                    <DisabledInput source="firstName" style={styles.inlineElementStyle}/>
                    <DisabledInput source="lastName" label="Last Name"/>
                  </div>
                  <div style={styles.inlineBlock}>
                    <DisabledInput source="phone1" label="Phone1" style={styles.inlineElementStyle}/>
                    <DisabledInput source="fax" label="Fax No" style={styles.inlineElementStyle}/>
                    <TextInput source="phone2" label="Phone2" />
                  </div>
                </div>
            }
          </SimpleForm>
        </Create>
      </Loadable>
    )
  }
}
