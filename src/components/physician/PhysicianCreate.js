import React from 'react'
import {Create, DisabledInput, SimpleForm, TextInput,
    SaveButton, Toolbar, CardActions, ListButton } from 'react-admin'
import Loadable from 'react-loading-overlay'
import SimpleButton from '../common/Button'
import {HttpStatus} from '../../utils/HttpStatusConstants'
import withStyles from '@material-ui/core/styles/withStyles';
import {SimpleDialog} from 'rmwc/Dialog'
import {parseMobileNumber, capitalize} from '../../utils/parsingUtils'
import ReactGA from 'react-ga';
import {API_URL} from '../../dataProvider';

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

  componentDidMount() {
      ReactGA.initialize('UA-123730827-1');
      ReactGA.pageview('/physician/create');
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
    const npiURL = API_URL  + '/phi/v1.0/get-physician-for-npi/?npi_id=' + this.npiInput;
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
    const PhysicianCreateToolbar = withStyles(styles)(({ classes, ...props }) => (
      <Toolbar {...props}>
        <SaveButton
            className={classes.button}
            hidden={true}
            disabled={this.state.saveDisabled}
        />
      </Toolbar>
    ));
      const PhysicianCreateActions = withStyles(styles)(({ basePath, data, classes }) => (
          <CardActions>
              <ListButton className={classes.button} basePath={basePath} record={data} />
          </CardActions>
      ));

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
        <Create {...props} record={physicianData} title="Add Physician" actions={<PhysicianCreateActions/>}>
          <SimpleForm toolbar={<PhysicianCreateToolbar/>} validate={validatePhysicianCreation} redirect="list">

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
                    <TextInput source="phone2" label="Phone2 (Optional)" />
                  </div>
                </div>
            }
          </SimpleForm>
        </Create>
      </Loadable>
    )
  }
}
