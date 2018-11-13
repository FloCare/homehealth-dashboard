
import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow, Polyline } from 'react-google-maps';
import {
    Create, Edit, SimpleForm, TextInput, SelectArrayInput, ReferenceArrayInput,
    LongTextInput, TabbedForm, FormTab, DisabledInput, ReferenceArrayField,
    SingleFieldList, ChipField, ReferenceInput, SelectInput, AutocompleteInput, Filter
} from 'react-admin';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
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
import {Images} from '../../utils/Images';
import {stringify} from 'query-string';
import {getDateFromDateTimeObject, getTomorrowDateFromDateTimeObject} from '../../utils/parsingUtils';
import {BASE_URL} from '../../utils/constants';

const PATIENT_LIST_API_URL = `${BASE_URL}/phi/v1.0/patients/?format=json&size=100`;
const USER_DETAILS_API_URL = `${BASE_URL}/users/v1.0/org-access/?format=json&size=100`;
const VISIT_DATA_API_URL = `${BASE_URL}/phi/v1.0/get-visits-for-org/`;

const tenThousandFeetToDegrees = 0.0274321;

var visitMarkerLabel1x = {
    url: Images.visitMarkerLabel,
    scaledSize: new window.google.maps.Size(65, 28),
    origin: new window.google.maps.Point(0, 0),
    anchor: new window.google.maps.Point(32,65),
    labelOrigin: new window.google.maps.Point(35,11)
};

var visitMarkerLabel2x = {
    url: Images.visitMarkerLabel,
    scaledSize: new window.google.maps.Size(110, 28),
    origin: new window.google.maps.Point(0, 0),
    anchor: new window.google.maps.Point(32,65),
    labelOrigin: new window.google.maps.Point(55,11)
};

var visitMarkerLabel3x = {
    url: Images.visitMarkerLabel,
    scaledSize: new window.google.maps.Size(160, 28),
    origin: new window.google.maps.Point(0, 0),
    anchor: new window.google.maps.Point(32,65),
    labelOrigin: new window.google.maps.Point(80,11)
};

var patientIconLabel = new window.google.maps.MarkerImage(
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
        maxWidth: '18%',
        borderRight: 'ridge',
    },
    listItemNestedStyle: {
        paddingLeft: theme.spacing.unit * 4,
    },
    root: {
        alignItems: 'left',
    },
    listItemDefaultStyle: {
        paddingTop: '1vh',
        height: '7vh',
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
        backgroundColor: '#F6F6F6'
    },
    disciplineLabelStyle: {
        lineHeight: '30px',
        fontSize: 12
    },
    radioMarginStyle: {
        marginLeft: -4
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
        marginLeft: '40vw',
    },
    suggestionsContainerOpen: {
        position: "absolute",
        zIndex: 1,
        marginTop: theme.spacing.unit,
    },
    dateFilterPaddingStyle: {
        marginLeft: '0.5%',
    },
    dense: {
        fontSize: 14,
        paddingLeft: 0.1
    },
    placeTextStyle: {
        textAlign: 'center'
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
        value: 'today',
        users: [],
        userDetailsMap: {},
        userIDNameMap: {},
        patients: [],
        disciplines:[],
        userRoleDetailsMap: {},
        visitsMap: {},
        filteredVisitsMap: {},
        duplicateVisitsMap: {},
        checkedMap: {},
        markersMap: {},
        isToday: true,
        isTomorrow: false,
        selectedPatient: '',
        selectedPatientLat: '',
        selectedPatientLong: '',
        selectedPatientName: '',
        chipSelectedPatient: '',
        suggestions: [],
        isOpen: {},
        position : null
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
        const {checkedMap} = this.state;
        var isCheckedMapEmpty = this.isEmpty(checkedMap);
        var formattedDate = date;
        if(date === undefined) {
            formattedDate = getDateFromDateTimeObject();
        }
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
            var tempDuplicateVisitsMap = {};
            var dupVisitsMap = {};
            var tempSingleVisitsMap = {};
            var tempMarkersMap = {};

            for(var i=0; i<resp.length; i++) {
                if(isCheckedMapEmpty === true || checkedMap[resp[i].userID] === true) {
                    var plannedStartTime = resp[i].plannedStartTime;
                    var s = new Date(plannedStartTime);
                    var nowUtc = new Date( s.getTime());
                    var hh = nowUtc.getHours() < 10 ? '0' +
                        nowUtc.getHours() : nowUtc.getHours();
                    var mi = nowUtc.getMinutes() < 10 ? '0' +
                        nowUtc.getMinutes() : nowUtc.getMinutes();
                    if(plannedStartTime === null) {
                        hh = '00';
                        mi = '00';
                    }
                    var res = resp[i];
                    if(res.episode === null){
                        var lat = res.place.address.latitude;
                        var lng = res.place.address.longitude;
                        if(tempSingleVisitsMap[lat] === undefined) {
                            tempSingleVisitsMap[lat] = lng;
                            tempDuplicateVisitsMap[lat.toString()+lng.toString()] = res.userID+ ":" + hh+"-"+mi + ":" + res.isDone;
                        }
                        else {
                            var userID = tempDuplicateVisitsMap[lat.toString()+lng.toString()];
                            var finalUserId = userID + ":" + res.userID+ ":" + hh+"-"+mi+ ":" + res.isDone;
                            tempDuplicateVisitsMap[lat.toString()+lng.toString()] = finalUserId;
                            tempMarkersMap[lat] = false;
                            dupVisitsMap[lat.toString()+lng.toString()] = finalUserId;
                        }
                    }
                    else {
                        var lat = res.episode.patient.address.latitude;
                        var lng = res.episode.patient.address.longitude;
                        if(tempSingleVisitsMap[res.episode.patient.address.latitude] === undefined) {
                            tempSingleVisitsMap[res.episode.patient.address.latitude] = res.episode.patient.address.longitude;
                            tempDuplicateVisitsMap[lat.toString()+lng.toString()] = res.userID+ ":" + hh+"-"+mi + ":" + res.isDone;
                        }
                        else {
                            var userID = tempDuplicateVisitsMap[lat.toString()+lng.toString()];
                            var finalUserId = userID + ":" + res.userID+ ":" + hh+"-"+mi+ ":" + res.isDone;
                            tempDuplicateVisitsMap[lat.toString()+lng.toString()] = finalUserId;
                            tempMarkersMap[res.episode.patient.address.latitude] = false;
                            dupVisitsMap[lat.toString()+lng.toString()] = finalUserId;
                        }
                    }
                }

            }

            for(var i=0; i<resp.length; i++) {
                if(isCheckedMapEmpty === true || checkedMap[resp[i].userID] === true) {
                    var plannedStartTime = resp[i].plannedStartTime;
                    var s = new Date(plannedStartTime);
                    var nowUtc = new Date( s.getTime());
                    var hh = nowUtc.getHours() < 10 ? '0' +
                        nowUtc.getHours() : nowUtc.getHours();
                    var mi = nowUtc.getMinutes() < 10 ? '0' +
                        nowUtc.getMinutes() : nowUtc.getMinutes();
                    if(plannedStartTime === null) {
                        hh = '00';
                        mi = '00';
                    }
                    tempVisitsMap[resp[i].userID] = tempVisitsMap[resp[i].userID] || [];
                    tempFilteredVisitsMap[resp[i].userID] = tempFilteredVisitsMap[resp[i].userID] || [];
                    if (resp[i].episode === null){
                        var lat = resp[i].place.address.latitude;
                        var lng = resp[i].place.address.longitude;
                        var placeName = resp[i].place.name;

                        tempVisitsMap[resp[i].userID].push({name: placeName, firstName: placeName,
                            lastName: placeName, userID: resp[i].userID, visitTime: hh+':'+mi,
                            latitude: lat, longitude: lng,
                            isDone: resp[i].isDone, isPlace: true});

                        tempFilteredVisitsMap[resp[i].userID].push({name: placeName, firstName: placeName,
                            lastName: placeName, userID: resp[i].userID, visitTime: hh+':'+mi,
                            latitude: lat, longitude: lng,
                            isDone: resp[i].isDone, isPlace: true});
                    }
                    else {
                        tempVisitsMap[resp[i].userID].push({name: resp[i].episode.patient.name, firstName: resp[i].episode.patient.firstName,
                            lastName: resp[i].episode.patient.lastName, userID: resp[i].userID, visitTime: hh+':'+mi,
                            latitude: resp[i].episode.patient.address.latitude, longitude: resp[i].episode.patient.address.longitude,
                            isDone: resp[i].isDone, isPlace: false});

                        tempFilteredVisitsMap[resp[i].userID].push({name: resp[i].episode.patient.name, firstName: resp[i].episode.patient.firstName,
                            lastName: resp[i].episode.patient.lastName, userID: resp[i].userID, visitTime: hh+':'+mi,
                            latitude: resp[i].episode.patient.address.latitude, longitude: resp[i].episode.patient.address.longitude,
                            isDone: resp[i].isDone, isPlace: false});
                    }
                }
            }
            this.setState({
                visitsMap: tempVisitsMap,
                filteredVisitsMap: tempFilteredVisitsMap,
                duplicateVisitMap : dupVisitsMap,
                markersMap : tempMarkersMap
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

    isEmpty(myObject) {
        for(var key in myObject) {
            if (myObject.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
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

    handleChange = event => {
            var formattedDate = getDateFromDateTimeObject();
            var tomorrow = getTomorrowDateFromDateTimeObject();
            if(event.target.value === 'today') {
                this.fetchVisitData(formattedDate)
            }
            else if(event.target.value === 'tomorrow') {
                this.fetchVisitData(tomorrow)
            }
        this.setState({ value: event.target.value, position: null });
    };

    // handleChange = name => event => {
    //     var formattedDate = getDateFromDateTimeObject();
    //     var tomorrow = getTomorrowDateFromDateTimeObject();
    //     if(name === 'isToday' && event.target.checked) {
    //         this.fetchVisitData(formattedDate)
    //         this.setState({ [name]: event.target.checked });
    //         this.setState({ 'isTomorrow': false });
    //     }
    //     else if(name === 'isTomorrow' && event.target.checked) {
    //         this.fetchVisitData(tomorrow)
    //         this.setState({ [name]: event.target.checked });
    //         this.setState({ 'isToday': false });
    //     }
    //     this.setState({ [name]: event.target.checked, filteredVisitsMap: {} });
    // };

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
                    selectedPatient: newValue,
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
                position: null
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
            {/*{this.renderDateView()}*/}
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
        </div>);
    }

    handleMarkerClick(value){

        this.setState({
            position : value
        })
    }

    swapArrayElements = function (a, x, y) {
        if (a.length === 1) return a;
        a.splice(y, 1, a.splice(x, 1, a[y])[0]);
        return a;
    };

    // TODO re-visit this logic
    reorderMarkerLabel(final) {
        var label = '';
        var j=0;
        for(var i=0; i<final.length; i+=3) {
            this.swapArrayElements(final, 3*j + 1, 3*j + 2);
            j++;
        }
        for(var i=0 ; i<final.length ; i++) {
            if((final[i] === '| ' && i === 0) || final[i] === undefined)
                continue;
            if(i === final.length-1 && final[i].includes('|')) {
                var formattedTime = final[i].trim().substring(0, final[i].trim().length - 2);
                if(formattedTime.includes('00:00')) {
                    label += formattedTime.replace(/0/g, '-');
                    continue;
                }
                else {
                    label += formattedTime;
                    continue;
                }

            }
            if(final[i].includes('00:00')) {
                label += final[i].replace(/0/g, '-');
                continue;
            }
            label += final[i];
        }
        return label;
    }

    render() {
        const { classes } = this.props;
        const {filteredVisitsMap, userDetailsMap, showInfoWindow, duplicateVisitMap, markersMap, checkedMap} = this.state;
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
            const patientLatLngNorth = new window.google.maps.LatLng(patLat + 2*tenThousandFeetToDegrees, patLong);
            const patientLatLngEast = new window.google.maps.LatLng(patLat, patLong + 2*tenThousandFeetToDegrees);
            const patientLatLngSouth = new window.google.maps.LatLng(patLat - 2*tenThousandFeetToDegrees, patLong);
            const patientLatLngWest = new window.google.maps.LatLng(patLat, patLong - 2*tenThousandFeetToDegrees);
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
                        // TODO Revisit multiple clinicians single patient marker logic
                        for (var j = 0; j < filteredVisitsMap[value].length; j++) {
                            var lat = filteredVisitsMap[value][j].latitude;
                            var long = filteredVisitsMap[value][j].longitude;
                            var isPlace = filteredVisitsMap[value][j].isPlace;
                            var placeName = filteredVisitsMap[value][j].name;
                            var lineSeparator = "-".repeat(placeName.length * 2);
                            var key = lat.toString()+long.toString();
                            if(duplicateVisitMap[key] != undefined) {
                                var strSplit = duplicateVisitMap[key].split(':');
                                var count = 0;
                                var k = 0;
                                var final = [];
                                for(var i = strSplit.length-1; i >= 0 ; i--) {
                                    var s = strSplit[i];
                                    if(checkedMap[s] != undefined) {
                                        if (i % 3 === 0) {
                                            final[k] = userDetailsMap[s][0].firstName.charAt(0) + userDetailsMap[s][0].lastName.charAt(0)+ ' ';
                                            count++;
                                        }
                                    }
                                    else if(i % 3 === 1 && checkedMap[strSplit[i-1]] != undefined) {
                                        var r = s.replace('-', ':');
                                        final[k] = r+ ' | ';
                                    }
                                    else if(i % 3 === 2 && checkedMap[strSplit[i-2]] != undefined) {
                                        if(s === 'true') {
                                            final[k] = '✓ ';
                                        }
                                        else {
                                            final[k] = ' ';
                                        }
                                    }
                                    k++;
                                }
                                var markerLabel = this.reorderMarkerLabel(final);
                                var visitsSize = markerLabel.split('|');
                                if(isPlace) {
                                    markers.push(<Marker
                                        position={{
                                            lat: lat,
                                            lng: long
                                        }}
                                        key={value}
                                        //show only the first staff visit time for stops
                                        label={{
                                            //text: visitsSize[0] + '|  ' + (visitsSize.length - 1) + ' More...',
                                            text: visitsSize[0] + ((visitsSize.length > 1) ? ('|  ' + (visitsSize.length - 1) + ' More...') : ''),
                                            color: "white",
                                            fontSize: "10px",
                                            textAlign: "left"
                                        }}
                                        icon={ visitMarkerLabel2x}
                                        onClick={() => this.handleMarkerClick(value)}
                                        // onClick={(e) => {
                                        //     console.log(e);
                                        //     markersMap[key] = true;
                                        //     this.setState({ isOpen: markersMap })
                                        // }}

                                    >
                                        {
                                            (this.state.position === value) &&
                                            <InfoWindow>
                                                <div className={classes.placeTextStyle}>
                                                    <div>{filteredVisitsMap[value][j].name}</div>
                                                    <div>{lineSeparator}</div>
                                                    <div>{markerLabel}</div>
                                                </div>
                                            </InfoWindow>
                                        }
                                    </Marker>);
                                }
                                else {
                                    markers.push(<Marker
                                        position={{
                                            lat: lat,
                                            lng: long
                                        }}
                                        key={value}
                                        label={{
                                            text: markerLabel,
                                            color: "white",
                                            fontSize: "10px",
                                            textAlign: "left"
                                        }}
                                        icon={ count === 1 ? visitMarkerLabel1x : (count % 2 === 0 ? visitMarkerLabel2x : visitMarkerLabel3x)}
                                        onClick={() => this.handleMarkerClick(value)}
                                        // onClick={(e) => {
                                        //     console.log(e);
                                        //     markersMap[key] = true;
                                        //     this.setState({ isOpen: markersMap })
                                        // }}

                                    >
                                        {
                                            (this.state.position === value) &&
                                            <InfoWindow>
                                                <span>{filteredVisitsMap[value][j].name}</span>
                                            </InfoWindow>
                                        }
                                    </Marker>);
                                }

                            } else {
                                var visitTime = filteredVisitsMap[value][j].visitTime;
                                if(visitTime.includes('00:00')) {
                                    visitTime = visitTime.replace(/0/g, '-');
                                }
                                if(filteredVisitsMap[value][j].isDone) {
                                    markers.push(<Marker
                                        position={{
                                            lat: filteredVisitsMap[value][j].latitude,
                                            lng: filteredVisitsMap[value][j].longitude
                                        }}
                                        key={value}
                                        label={{
                                            text: '✓  ' +userDetailsMap[filteredVisitsMap[value][j].userID][0].firstName.charAt(0) +
                                            userDetailsMap[filteredVisitsMap[value][j].userID][0].lastName.charAt(0) + '\n ' + visitTime,
                                            color: "white",
                                            fontSize: "10px",
                                            textAlign: "left"
                                        }}
                                        icon={visitMarkerLabel1x}
                                        onClick={() => this.handleMarkerClick(value)}
                                        // onClick={(e) => {
                                        //     console.log(e);
                                        //     markersMap[key] = true;
                                        //     this.setState({ isOpen: markersMap })
                                        // }}

                                    >
                                        {
                                            (this.state.position === value) &&
                                            <InfoWindow>
                                                <span>{filteredVisitsMap[value][j].name}</span>
                                            </InfoWindow>
                                        }
                                    </Marker>);
                                }
                                else {
                                    markers.push(<Marker
                                        position={{
                                            lat: filteredVisitsMap[value][j].latitude,
                                            lng: filteredVisitsMap[value][j].longitude
                                        }}
                                        key={value}
                                        label={{
                                            text: ' ' + userDetailsMap[filteredVisitsMap[value][j].userID][0].firstName.charAt(0) +
                                            userDetailsMap[filteredVisitsMap[value][j].userID][0].lastName.charAt(0) + ' ' + visitTime,
                                            color: "white",
                                            fontSize: "10px",
                                            textAlign: "left"
                                        }}
                                        icon={visitMarkerLabel1x}
                                        onClick={() => this.handleMarkerClick(value)}
                                        // onClick={(e) => {
                                        //     console.log(e);
                                        //     markersMap[key] = true;
                                        //     this.setState({ isOpen: markersMap })
                                        // }}

                                    >
                                        {
                                            (this.state.position === value) &&
                                            <InfoWindow>
                                                <span>{filteredVisitsMap[value][j].name}</span>
                                            </InfoWindow>
                                        }
                                    </Marker>);
                                }
                            }
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
                    <RadioGroup
                        aria-label="Gender"
                        name="gender1"
                        className={classes.group}
                        value={this.state.value}
                        onChange={this.handleChange}
                        row={true}
                    >
                        <FormControlLabel classes={{
                            root: classes.radioMarginStyle
                        }} value="today" control={<Radio color="primary" />} label="Today" />
                        <FormControlLabel value="tomorrow" control={<Radio color="primary" />} label="Tomorrow" />
                    </RadioGroup>
                    </div>
                    {/*<FormLabel component="legend">Date:</FormLabel>*/}
                    {/*<div className={classes.dateFilterPaddingStyle}>*/}
                        {/*<FormControlLabel*/}
                            {/*control={*/}
                                {/*<Checkbox*/}
                                    {/*checked={this.state.isToday}*/}
                                    {/*onChange={this.handleChange('isToday')}*/}
                                    {/*value="isToday"*/}
                                    {/*color="primary"*/}
                                {/*/>*/}
                            {/*}*/}
                            {/*label="Today"*/}
                        {/*/>*/}
                        {/*<FormControlLabel*/}
                            {/*control={*/}
                                {/*<Checkbox*/}
                                    {/*checked={this.state.isTomorrow}*/}
                                    {/*onChange={this.handleChange('isTomorrow')}*/}
                                    {/*value="isTomorrow"*/}
                                    {/*color="primary"*/}
                                {/*/>*/}
                            {/*}*/}
                            {/*label="Tomorrow"*/}
                        {/*/>*/}
                    {/*</div>*/}
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
                                    <ListItemText classes={{
                                        primary: classes.dense
                                    }} inset primary="All Staff" />
                                </ListItem>
                                {(this.state.disciplines).map(value => {
                                    if(value.role != 'Admin')
                                    return (<div>
                                        <List
                                            component="nav"
                                            dense={false}
                                            subheader={<ListSubheader classes={{
                                                sticky: classes.disciplineBkgColor,
                                                root: classes.disciplineLabelStyle
                                            }} component="div">{value.role}s</ListSubheader>}
                                        />
                                        <List component="div" disablePadding>
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
                                                    <ListItemText classes={{
                                                        primary: classes.dense
                                                    }} inset primary={`${user.name}`}/>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </div>)
                                })}
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

