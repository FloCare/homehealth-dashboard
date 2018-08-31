
import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import {
    Create, Edit, SimpleForm, TextInput, SelectArrayInput, ReferenceArrayInput,
    LongTextInput, TabbedForm, FormTab, DisabledInput, ReferenceArrayField,
    SingleFieldList, ChipField, ReferenceInput, SelectInput, AutocompleteInput, Filter
} from 'react-admin';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import FormLabel from '@material-ui/core/FormLabel';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';
import PeopleIcon from '@material-ui/icons/Person';
import DateIcon from '@material-ui/icons/DateRange';
import {Images} from './Images';
import {stringify} from 'query-string';
import {getDateFromDateTimeObject, getTomorrowDateFromDateTimeObject} from './parsingUtils'

const PATIENT_LIST_API_URL = 'https://app-9707.on-aptible.com/phi/v1.0/patients/?format=json&size=100';
//const PATIENT_LIST_API_URL = 'https://app-9781.on-aptible.com/phi/v1.0/patients/?format=json&size=100';
//const PATIENT_LIST_API_URL = 'http://localhost:8000/phi/v1.0/patients/?format=json&size=100';

const USER_DETAILS_API_URL = 'https://app-9707.on-aptible.com/users/v1.0/org-access/?format=json&size=100';
//const USER_DETAILS_API_URL = 'https://app-9781.on-aptible.com/users/v1.0/org-access/?format=json&size=100';
//const USER_DETAILS_API_URL = 'http://localhost:8000/users/v1.0/org-access/?format=json&size=100';

const VISIT_DATA_API_URL = 'https://app-9707.on-aptible.com/phi/v1.0/get-visits-for-org/';
//const VISIT_DATA_API_URL = 'https://app-9781.on-aptible.com/phi/v1.0/get-visits-for-org/';
//const VISIT_DATA_API_URL = 'http://localhost:8000/phi/v1.0/get-visits-for-org/';

const tenThousandFeetToDegrees = 0.0274321;

let visitDoneLabel = new window.google.maps.MarkerImage(
    Images.visitDoneLabel,
    null, /* size is determined at runtime */
    new window.google.maps.Point(-5, 0), /* origin is 0,0 */
    null, /* anchor is bottom center of the scaled image */
    new window.google.maps.Size(84, 32)
);
let visitNotDoneLabel = new window.google.maps.MarkerImage(
    Images.visitNotDoneLabel,
    null, /* size is determined at runtime */
    new window.google.maps.Point(-5, 0), /* origin is 0,0 */
    null, /* anchor is bottom center of the scaled image */
    new window.google.maps.Size(84, 32)
);
let patientIconLabel = new window.google.maps.MarkerImage(
    Images.patientIconLabel,
    null, /* size is determined at runtime */
    new window.google.maps.Point(0, 0), /* origin is 0,0 */
    null, /* anchor is bottom center of the scaled image */
    new window.google.maps.Size(96, 32)
);

const styles = theme => ({
    leftNavStyle: {
        width: '100%',
        height: '74vh',
        maxWidth: '20%',
        borderRight: 'ridge',
    },
    listItemNestedStyle: {
        paddingLeft: theme.spacing.unit * 4,
    },
    listItemDefaultStyle: {
        paddingTop: 0,
        paddingBottom: 0.001,
        height: '1%'
    },
    listItemButtonStyle: {
        '&:hover': {
            textDecoration: 'none',
            backgroundColor: 'none',
        }
    },
    inlineBlock: {
        width: '100%',
        height: '74vh',
        display: 'inline-flex',
    },
    disciplineBkgColor: {
        backgroundColor: '#D3D3D3'
    },
    disciplineLabelStyle: {
        lineHeight: '32px',
    },
    chipStyle: {
        margin: theme.spacing.unit,
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    rootLevelStyle: {
        borderLeft: 'ridge',
        borderRight: 'ridge',
        borderBottom: 'ridge',
        marginTop: '0.1%',
        width: '100%',
        height: '100%',

    },
    borderStyle: {
        width: '100%',
        borderLeft: 'ridge',
        borderRight: 'ridge',
        borderBottom: 'ridge'

    },
    topViewStyle: {
        width: '100%',
        height: '6%',
        marginTop: '0.1%',
        marginBottom: '0.1%',
        marginLeft: '1%',
        display: 'inline-flex',
        alignItems: 'center',
    },
    filterStyle: {
        display: 'inline-flex',
        alignItems: 'center',
        marginLeft: '1%',
        marginTop: '1%',
        marginBottom: '1%',
    },
    searchBoxStyle: {
        position: 'relative',
        display: 'inline-flex',
        marginLeft: '38vw',
    },
    suggestionsContainerOpen: {
        position: "absolute",
        zIndex: 1,
        marginTop: theme.spacing.unit,
    },
    dateFilterPaddingStyle: {
        marginLeft: '0.5%',
    },
});

var suggestions = [];

function renderInputComponent(inputProps) {
    const { classes, inputRef = () => {}, ref, ...other } = inputProps;

    return (
        <TextField
            fullWidth={false}
            InputProps={{
                inputRef: node => {
                    ref(node);
                    inputRef(node);
                },
                classes: {
                    input: classes.input,
                },
            }}
            {...other}
        />
    );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);

    return (
            <div style={{width: '160px', paddingLeft: '10px', marginBottom: '3px'}}>
                {parts.map((part, index) => {
                    return part.highlight ? (
                        <span key={String(index)} style={{ fontWeight: 100 }}>
              {part.text}
            </span>
                    ) : (
                        <strong key={String(index)} style={{ fontWeight: 100 }}>
                            {part.text}
                        </strong>
                    );
                })}
            </div>
    );
}

function getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;
    return inputLength === 0
        ? []
        : suggestions.filter(suggestion => {
            const keep =
                count < 10 && suggestion.name.toLowerCase().slice(0, inputLength) === inputValue;

            if (keep) {
                count += 1;
            }
            return keep;
        });
}

function getSuggestionValue(suggestion) {
    return suggestion.name;
}

class Scheduler extends Component {

    state = {
        users: [],
        userDetailsMap: {},
        userIDNameMap: {},
        patients: [],
        disciplines:[],
        userRoleDetailsMap: {},
        visitsMap: {},
        filteredVisitsMap: {},
        checkedMap: {},
        isToday: true,
        isTomorrow: false,
        selectedPatient: '',
        selectedPatientLat: '',
        selectedPatientLong: '',
        selectedPatientName: '',
        chipSelectedPatient: '',
        suggestions: [],
        isOpen: {}
    };

    componentWillMount() {
        //TODO handle the returned promise
        var userData = this.fetchUsersData();
        var visitData = this.fetchVisitData();
        var patientData = this.fetchPatientData();
    }

    async fetchPatientData() {
        const request = new Request(PATIENT_LIST_API_URL, {
            headers: new Headers({ 'Authorization': 'Token '+ localStorage.getItem('access_token')
            }),
        })
        const res = await fetch(request).then((resp) => {
            return resp.json();
        }).then((resp) => {
            var list = [];
            for (var i = 0; i < resp.length; i++) {
                var patient = resp[i].patient;
                list.push({ id: patient.id, name: patient.firstName+' '+patient.lastName,
                            latitude: patient.address.latitude, longitude: patient.address.longitude});
            }
            this.setState({
                patients: [...this.state.patients, ...list]
            });
            suggestions = this.state.patients;
            return resp;
        });
    }

    async fetchVisitData(date) {
        var formattedDate = date;
        if(date === undefined) {
            formattedDate = getDateFromDateTimeObject();
        }
        // TODO remove the hardcoded date which was added for testing
        const request = new Request(VISIT_DATA_API_URL+formattedDate+'/', {
            headers: new Headers({ 'Authorization': 'Token '+ localStorage.getItem('access_token')
            }),
        })
        const res = await fetch(request).then((resp) => {
            if(resp.status === 200) {
                return resp.json();
            }
            // TODO
            else return [];
        }).then((resp) => {
            var tempVisitsMap = {};
            var tempFilteredVisitsMap = {};
            for(var i=0; i<resp.length; i++) {
                var plannedStartTime = resp[i].plannedStartTime;
                var s = new Date(plannedStartTime);
                var nowUtc = new Date( s.getTime() + (s.getTimezoneOffset() * 60000));
                var hh = nowUtc.getHours() < 10 ? '0' +
                    nowUtc.getHours() : nowUtc.getHours();
                var mi = nowUtc.getMinutes() < 10 ? '0' +
                    nowUtc.getMinutes() : nowUtc.getMinutes();
                tempVisitsMap[resp[i].userID] = tempVisitsMap[resp[i].userID] || [];
                tempVisitsMap[resp[i].userID].push({name: resp[i].episode.patient.name, firstName: resp[i].episode.patient.firstName,
                    lastName: resp[i].episode.patient.lastName, userID: resp[i].userID, visitTime: hh+':'+mi,
                    latitude: resp[i].episode.patient.address.latitude, longitude: resp[i].episode.patient.address.longitude,
                    isDone: resp[i].isDone});

                tempFilteredVisitsMap[resp[i].userID] = tempFilteredVisitsMap[resp[i].userID] || [];
                tempFilteredVisitsMap[resp[i].userID].push({name: resp[i].episode.patient.name, firstName: resp[i].episode.patient.firstName,
                    lastName: resp[i].episode.patient.lastName, userID: resp[i].userID, visitTime: hh+':'+mi,
                    latitude: resp[i].episode.patient.address.latitude, longitude: resp[i].episode.patient.address.longitude,
                    isDone: resp[i].isDone});

            }
            this.setState({
                visitsMap: tempVisitsMap,
                filteredVisitsMap: tempFilteredVisitsMap
            });
            return resp;
        });
    }


    async fetchUsersData() {
        const request = new Request(USER_DETAILS_API_URL, {
            headers: new Headers({ 'Authorization': 'Token '+ localStorage.getItem('access_token')
            }),
        })
        const res = await fetch(request).then((resp) => {
            return resp.json();
        }).then((resp) => {
            var aMap = {};
            var userCheckedMap = {};
            var tempUserIDNameMap = {};
            var tempUserDetailsMap = {};
            var list = [];
            var disciplines = [];
            var disciplineArray = [];
            var users = resp.users;
            for (var i = 0; i < users.length; i++) {
                list.push({ id: users[i].id, name: users[i].last_name+' '+users[i].first_name });
                if(disciplineArray.indexOf(users[i].user_role) == -1){
                    disciplines.push({role: users[i].user_role});
                    disciplineArray.push(users[i].user_role);
                }
                aMap[users[i].user_role] = aMap[users[i].user_role] || [];
                aMap[users[i].user_role].push({name : users[i].last_name+' '+users[i].first_name, id : users[i].id});

                tempUserDetailsMap[users[i].id] = tempUserDetailsMap[users[i].id] || [];
                tempUserDetailsMap[users[i].id].push({firstName: users[i].first_name,
                    lastName: users[i].last_name, userRole: users[i].user_role});

                tempUserIDNameMap[users[i].id] = users[i].last_name+' '+users[i].first_name;
                userCheckedMap[users[i].id] = true;
            }
            userCheckedMap["All Staff"] = true;
            this.setState({
                users: [...this.state.users, ...list],
                disciplines: [...this.state.disciplines, ...disciplines],
                userRoleDetailsMap: aMap,
                userDetailsMap: tempUserDetailsMap,
                userIDNameMap: tempUserIDNameMap,
                checkedMap: userCheckedMap
            });
            return resp;
        });
    }

    handleDelete = data => () => {
        const {checkedMap, users, filteredVisitsMap, visitsMap} = this.state;
        var newChecked = {};
        var newFilteredVisitsMap = {};
        newFilteredVisitsMap = filteredVisitsMap;
        const currentIndex = checkedMap[data];
        newChecked = checkedMap;
        if(data === 'isToday') {
            this.setState({ 'isToday': false, filteredVisitsMap: {} });

        }
        else if(data === 'isTomorrow') {
            this.setState({ 'isTomorrow': false, filteredVisitsMap: {} });
        }
        else if(data === 'All Staff') {
            this.setState({checkedMap : {}});
            for (var i = 0; i < users.length; i++) {
                if(currentIndex === undefined) {
                    newChecked[users[i].id] = true;
                    newFilteredVisitsMap[users[i].id] = visitsMap[users[i].id];
                } else {
                    delete newChecked[users[i].id];
                    delete newFilteredVisitsMap[users[i].id];
                }
            }
            if(currentIndex === undefined) {
                newChecked[data] = true;
            } else {
                delete newChecked[data];
            }

            this.setState({
                checkedMap: newChecked,
                filteredVisitsMap: newFilteredVisitsMap
            });
            return ;
        }
        else if(data === 'selectedPatient') {
            this.setState({chipSelectedPatient: '',
                            selectedPatient: '',
                            selectedPatientLat: '',
                            selectedPatientLong: '',
                            selectedPatientName: ''
            })
        }
        else {
            delete newChecked[data];
            delete newFilteredVisitsMap[data];
            this.setState({
                checkedMap: newChecked,
                filteredVisitsMap: newFilteredVisitsMap
            });
            return ;
        }
    };

    handleChange = name => event => {
        // TODO fetch today and tomorrow and pass the relevant param
        var formattedDate = getDateFromDateTimeObject();
        var tomorrow = getTomorrowDateFromDateTimeObject();
        if(name === 'isToday' && event.target.checked) {
            this.fetchVisitData(formattedDate)
            this.setState({ [name]: event.target.checked });
            this.setState({ 'isTomorrow': false });
        }
        else if(name === 'isTomorrow' && event.target.checked) {
            this.fetchVisitData(tomorrow)
            this.setState({ [name]: event.target.checked });
            this.setState({ 'isToday': false });
        }
        this.setState({ [name]: event.target.checked, filteredVisitsMap: {} });
    };
    
    handleToggle = value => () => {
        const {checkedMap, users, filteredVisitsMap, visitsMap} = this.state;
        var newChecked = {};
        var newFilteredVisitsMap = {};
        newFilteredVisitsMap = filteredVisitsMap;
        const currentIndex = checkedMap[value];
        if(value === 'All Staff') {
            for (var i = 0; i < users.length; i++) {
                if(currentIndex === undefined) {
                    newChecked[users[i].id] = true;
                    newFilteredVisitsMap[users[i].id] = visitsMap[users[i].id];
                } else {
                    delete newChecked[users[i].id];
                    delete newFilteredVisitsMap[users[i].id];
                }
            }
            if(currentIndex === undefined) {
                newChecked[value] = true;
            } else {
                delete newChecked[value];
            }

            this.setState({
                checkedMap: newChecked,
                filteredVisitsMap: newFilteredVisitsMap
            });
            return ;
        }
        newChecked = checkedMap;
        var keys = Object.keys(newChecked);

        if (currentIndex === undefined) {
            newChecked[value] = true;
            newFilteredVisitsMap[value] = visitsMap[value];
            if(keys.length === users.length - 1) {
                newChecked["All Staff"] = true;
            }
        } else {
            delete newChecked[value];
            delete newFilteredVisitsMap[value];
            if(keys.includes("All Staff")) {
                delete newChecked["All Staff"];
            }
        }
        this.setState({
            checkedMap: newChecked,
            filteredVisitsMap: newFilteredVisitsMap
        });
    }

    handleSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            patients: getSuggestions(value),
        });
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            patients: [],
        });
    };

    handlePatientSelection = name => (event, { newValue }) => {
        const {patients} = this.state;
        patients.map(patient => {
            if(patient.name === newValue) {
                this.setState({
                    chipSelectedPatient: newValue,
                    selectedPatientLat: patient.latitude,
                    selectedPatientLong: patient.longitude,
                    selectedPatientName: patient.name
                });
                return;
            }
        });
        if(this.state.chipSelectedPatient !== '') {
            this.setState({
                [name]: '',
            });
        }
        else {
            this.setState({
                [name]: newValue,
            });
        }

    };

    renderDateView() {
        const { classes } = this.props;
        if (this.state.isToday) {
            return (
                <Chip
                    label="Today"
                    avatar={
                        <Avatar>
                            <DateIcon />
                        </Avatar>
                    }
                    onDelete={this.handleDelete('isToday')}
                    className={classes.chipStyle}
                    color="primary"
                />
            )
        }
        if (this.state.isTomorrow) {
            return (
                <Chip
                    label="Tomorrow"
                    avatar={
                        <Avatar>
                            <DateIcon />
                        </Avatar>
                    }
                    onDelete={this.handleDelete('isTomorrow')}
                    className={classes.chipStyle}
                    color="primary"
                />
            )
        }
    }

    renderFilterByView() {
        const { classes } = this.props;
        const {checkedMap, patients, userIDNameMap} = this.state;
        var keys = Object.keys(checkedMap);
        var users = this.state.users;
        return (<div >
            {this.renderDateView()}
            {(keys.length !== users.length && !keys.includes("All Staff")) ? keys.map(value => (
                <Chip
                    label={userIDNameMap[`${value}`]}
                    avatar={
                        <Avatar>
                            <FaceIcon />
                        </Avatar>
                    }
                    onDelete={this.handleDelete(value)}
                    className={classes.chipStyle}
                    color="primary"
                />

            )) : <Chip
                label="All Staff"
                avatar={
                    <Avatar>
                        <FaceIcon />
                    </Avatar>
                }
                onDelete={this.handleDelete('All Staff')}
                className={classes.chipStyle}
                color="primary"
            />}
            <div className={classes.searchBoxStyle}>
            {
                this.state.chipSelectedPatient != '' ?
                    <Chip
                        label={`Patient | ${this.state.chipSelectedPatient}`}
                        avatar={
                            <Avatar>
                                <PeopleIcon />
                            </Avatar>
                        }
                        onDelete={this.handleDelete('selectedPatient')}
                        className={classes.chipStyle}
                        color="primary"
                    /> : <div/>
            }
            </div>
        </div>);
    }

    render() {
        const { classes } = this.props;
        const {filteredVisitsMap, userDetailsMap, showInfoWindow} = this.state;
        var formattedDate = getDateFromDateTimeObject();
        var visitMapKeys = Object.keys(filteredVisitsMap);
        var userDetailsMapKeys = Object.keys(userDetailsMap);
        const autosuggestProps = {
            renderInputComponent,
            suggestions: this.state.patients,
            onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
            onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
            getSuggestionValue,
            renderSuggestion,
        };

        const bounds = new window.google.maps.LatLngBounds();
        if(this.state.selectedPatientLat !== '' && this.state.selectedPatientLong !== '') {
            // TODO figure out a right way to create a boundary circle once a patient is selected
            var patLat = this.state.selectedPatientLat;
            var patLong = this.state.selectedPatientLong;
            const patientLatLng = new window.google.maps.LatLng(patLat, patLong);
            const patientLatLngNorth = new window.google.maps.LatLng(patLat + tenThousandFeetToDegrees, patLong);
            const patientLatLngEast = new window.google.maps.LatLng(patLat, patLong + tenThousandFeetToDegrees);
            const patientLatLngSouth = new window.google.maps.LatLng(patLat - tenThousandFeetToDegrees, patLong);
            const patientLatLngWest = new window.google.maps.LatLng(patLat, patLong - tenThousandFeetToDegrees);
            bounds.extend(patientLatLng);
            bounds.extend(patientLatLngNorth);
            bounds.extend(patientLatLngEast);
            bounds.extend(patientLatLngSouth);
            bounds.extend(patientLatLngWest);
        }
        else if((this.state.selectedPatientLat === '' && this.state.selectedPatientLong === '')
            && visitMapKeys.length > 0 && userDetailsMapKeys.length > 0) {
            visitMapKeys.map(value => {
                if(filteredVisitsMap[value] !== undefined) {
                    for (var j = 0; j < filteredVisitsMap[value].length; j++) {
                        const latLng = new window.google.maps.LatLng(filteredVisitsMap[value][j].latitude, filteredVisitsMap[value][j].longitude);
                        bounds.extend(latLng);
                    }
                }

            })
        }

        // TODO work on markers click to show patient details in next version
        const GoogleMapExample = withGoogleMap(props => (
            <GoogleMap
                defaultCenter = { { lat: 40.756795, lng: -73.954298 } }
                defaultZoom = { 20 }
                ref={(map) => {
                    if(map != null) {
                        map.fitBounds(bounds);
                    }

                }}
            >
                {(visitMapKeys.length > 0 && userDetailsMapKeys.length > 0) ? visitMapKeys.map(value => {
                    if(filteredVisitsMap[value] !== undefined) {
                        var markers = [];
                        for (var j = 0; j < filteredVisitsMap[value].length; j++) {
                            var lat = filteredVisitsMap[value][j].latitude;
                            var long = filteredVisitsMap[value][j].longitude;
                            var key = lat.toString()+long.toString();
                            markers.push(<Marker
                                position={{
                                    lat: filteredVisitsMap[value][j].latitude,
                                    lng: filteredVisitsMap[value][j].longitude
                                }}
                                key={key}
                                label={{
                                    text: userDetailsMap[filteredVisitsMap[value][j].userID][0].firstName.charAt(0) +
                                    userDetailsMap[filteredVisitsMap[value][j].userID][0].lastName.charAt(0) + ' ' + filteredVisitsMap[value][j].visitTime,
                                    color: "white",
                                    fontSize: "10px",
                                    textAlign: "left"
                                }}
                                icon={filteredVisitsMap[value][j].isDone ? visitDoneLabel : visitNotDoneLabel}
                                // onClick={(e) => {
                                //     console.log(key);
                                //     var markersMap = {};
                                //     markersMap[key] = true;
                                //     this.setState({ isOpen: markersMap })
                                // }}

                            >
                            </Marker>);
                        }
                        return markers;
                    }

                }) : <Marker/>}
                {this.state.chipSelectedPatient != '' ? <Marker
                    position={ { lat: this.state.selectedPatientLat, lng: this.state.selectedPatientLong } }
                    key="selectedPatient"
                    label={{
                        text: this.state.selectedPatientName,
                        color: "white",
                        fontSize: "12px",
                    }}
                    icon={patientIconLabel}
                /> : <Marker/>}


            </GoogleMap>
        ));
        return(
            <div className={classes.rootLevelStyle}>
                <div className={classes.topViewStyle}>
                    <FormLabel component="legend">Date:</FormLabel>
                    <div className={classes.dateFilterPaddingStyle}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.isToday}
                                onChange={this.handleChange('isToday')}
                                value="isToday"
                                color="primary"
                            />
                        }
                        label="Today"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.isTomorrow}
                                onChange={this.handleChange('isTomorrow')}
                                value="isTomorrow"
                                color="primary"
                            />
                        }
                        label="Tomorrow"
                    />
                </div>
                    <div className={classes.searchBoxStyle}>
                        <Autosuggest
                            {...autosuggestProps}
                            inputProps={{
                                classes,
                                placeholder: 'Search Patients',
                                value: this.state.selectedPatient,
                                onChange: this.handlePatientSelection('selectedPatient'),
                            }}
                            theme={{
                                container: classes.container,
                                suggestionsContainerOpen: classes.suggestionsContainerOpen,
                                suggestionsList: classes.suggestionsList,
                                suggestion: classes.suggestion,
                            }}
                            renderSuggestionsContainer={options => (
                                <Paper {...options.containerProps} square>
                                    {options.children}
                                </Paper>
                            )}
                        />
                    </div>
                </div>
                <Divider />
                <Divider />
                <div className={classes.filterStyle}>
                    <FormLabel component="legend">Filters:</FormLabel>
                    {this.renderFilterByView()}
                </div>
                <Divider />
                <Divider />
                <div className={classes.inlineBlock} >
                    <div className={classes.leftNavStyle}>
                        <Paper style={{maxHeight: '100%', overflow: 'auto'}}>
                        <List component="div" disablePadding >
                                <ListItem
                                    classes={{
                                        default: classes.listItemDefaultStyle,
                                        button: classes.listItemButtonStyle
                                    }}
                                    button
                                    onClick={this.handleToggle('All Staff')}
                                    className={classes.listItemNestedStyle}>
                                    <Checkbox
                                        checked={this.state.checkedMap['All Staff'] === true}
                                        tabIndex={-1}
                                        disableRipple
                                        color="primary"
                                    />
                                    <ListItemText inset primary="All Staff" />
                                </ListItem>
                            {(this.state.disciplines).map(value => (
                                <div>
                                    <List
                                        component="nav"
                                        dense={false}
                                        subheader={<ListSubheader classes={{
                                            sticky: classes.disciplineBkgColor,
                                            root: classes.disciplineLabelStyle
                                        }} component="div">{value.role}s</ListSubheader>}
                                    />
                                    <List component="div" disablePadding >
                                        {(this.state.userRoleDetailsMap[value.role]).map(user => (
                                            <ListItem
                                                classes={{
                                                    default: classes.listItemDefaultStyle,
                                                    button: classes.listItemButtonStyle
                                                }}
                                                button
                                                onClick={this.handleToggle(user.id)}
                                                className={classes.listItemNestedStyle}>
                                                <Checkbox
                                                    checked={this.state.checkedMap[user.id] === true}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    color="primary"
                                                />
                                                <ListItemText inset primary={`${user.name}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>
                            ))}
                        </List>
                        </Paper>

                    </div>
                    <GoogleMapExample
                        containerElement={ <div style={{ height: `10%`, width: '100%' }} /> }
                        mapElement={ <div style={{ height: `74vh` }} /> }
                    />
                </div>
            </div>
        );
    }
};
export default withStyles(styles)(Scheduler);