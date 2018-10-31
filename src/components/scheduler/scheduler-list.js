
import React, { Component } from 'react';
import moment from 'moment/moment';
import {
    Create, Edit, SimpleForm, TextInput, SelectArrayInput, ReferenceArrayInput,
    LongTextInput, TabbedForm, FormTab, DisabledInput, ReferenceArrayField,
    SingleFieldList, ChipField, ReferenceInput, SelectInput, AutocompleteInput, Filter
} from 'react-admin';
import { withStyles } from '@material-ui/core/styles';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Button from '@material-ui/core/Button';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import {stringify} from 'query-string';
import {getDateFromDateTimeObject} from '../../utils/parsingUtils';
import {BASE_URL} from '../../utils/constants';
import VisitListRow from "../common/VisitListRow";

const PATIENT_LIST_API_URL = `${BASE_URL}/phi/v1.0/patients/?format=json&size=100`;
const USER_DETAILS_API_URL = `${BASE_URL}/users/v1.0/org-access/?format=json&size=100`;
const VISIT_DATA_API_URL = `${BASE_URL}/phi/v1.0/get-visits-for-org/`;

const styles = theme => ({
    root: {
        marginLeft: '10px',
        marginRight: '10px',
        marginTop: '10px',
        marginBottom: '10px',
    },
    rootLevelStyle: {
        borderLeft: 'ridge',
        borderRight: 'ridge',
        marginTop: '0.1%',
        width: '95%',
        height: '100%',

    },
    disciplineBkgColor: {
        backgroundColor: '#c4c4c4'
    },
    disciplineLabelStyle: {
        lineHeight: '30px',
        fontSize: 12
    },
    staffStyle: {
        marginLeft: '2%',
        height: '10vh'
    },
    staffStyle1: {
        marginTop: '2%',
        marginBottom: '2%',
    },
    staffStyle2: {
        marginLeft: '4.5vw',
        marginRight: '4.5vw',
        textAlign: 'center'
    },
    verticalStyle: {
        borderLeft: '1px',
        height: '100vh',
    },
    paperStyle: {
        marginTop: '3vh',
        float: 'left',
        width: '8vw'
    },
    paperStyle1: {
        marginBottom: '0px',
        width: '90vw'
    },
    paperStyle2: {
        float: 'left',
        borderLeft: '1px solid grey',
        paddingLeft: '20px',
        height: '10vh',
        width: '9.5vw'
    },
    daysOfWeekStyle1: {
        marginLeft: '7vw',
    },
    daysOfWeekStyle: {
        position: 'relative',
        display: 'inline',
        marginLeft: '6.5vw',
    },
    stripStyle: {
        textAlign: 'center'
    },
    padding: {
        paddingTop: '0px',
        paddingBottom: '0px'
    },
});


class SchedulerList extends Component {

    state = {
        startOfWeek: '',
        endOfWeek: '',
        year: '',
        today: '',
        users: [],
        userDetailsMap: {},
        userIDNameMap: {},
        disciplines:[],
        daysOfWeek: [],
        userRoleDetailsMap: {},
        visitsMap: {},
        filteredVisitsMap: {},
        duplicateVisitsMap: {},
        checkedMap: {},
        position : null
    };

    componentWillMount() {

        const {today} = this.state;
        //var startOfWeek = moment().startOf('week').format("ddd M/D");
        var startOfWeek = moment().startOf('week').format("MMM D");
        var weekStart = moment().startOf('week').format("MMM M/D");
        //var endOfWeek = moment().endOf('week').format("ddd M/D");
        var endOfWeek = moment().endOf('week').format("MMM D");
        var weekEnd = moment().endOf('week').format("MMM M/D");
        var defaultWeekdays = Array.apply(null, Array(7)).map(function (_, i) {
            return moment(i, 'e').endOf('week').isoWeekday(i).format('MMM M/D');
        });
        var year = moment().year();
        this.setState({startOfWeek : startOfWeek,
                        endOfWeek: endOfWeek,
                        year: year,
                        today: moment().toDate(),
                        daysOfWeek: defaultWeekdays})


        var days = [];
        var day = startOfWeek;
        //TODO handle the returned promise
        var userData = this.fetchUsersData();
        var visitData = this.fetchVisitData();
        // var patientData = this.fetchPatientData();
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


    async fetchVisitData(date) {
        const {checkedMap} = this.state;
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

            for(var i=0; i<resp.length; i++) {
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
                var row = resp[i].episode.patient.name + '  ' + hh+':'+mi;
                tempVisitsMap[resp[i].userID] = tempVisitsMap[resp[i].userID] || [];
                tempVisitsMap[resp[i].userID].push({'31-10-2018': row});
                tempVisitsMap[resp[i].userID].push({'30-10-2018': row});
                tempVisitsMap[resp[i].userID].push({'01-11-2018': row});

            }
            this.setState({
                visitsMap: tempVisitsMap
            });
            return resp;
        });
    }

    renderDateStrip() {
        const {startOfWeek, endOfWeek, year, today} = this.state;
        const { classes } = this.props;

        return (<div className={classes.stripStyle}>
            <Button color="#fff" onClick={() => {
                        var start = moment(today).subtract(1, 'week').startOf('week').format("MMM D");
                        var end = moment(today).subtract(1, 'week').endOf('week').format("MMM D");
                        var year = moment(today).year();
                        this.setState({today : start.valueOf(),
                                        startOfWeek: start,
                                        endOfWeek: end,
                                        year: year})

                    }}>
                <ChevronLeft />
            </Button>
            <font size="3" color="black">{startOfWeek} - {endOfWeek}, {year}</font>
            <Button color="#fff" onClick={() => {
                        var start = moment(today).add(1, 'week').startOf('week').format("MMM D");
                        var end = moment(today).add(1, 'week').endOf('week').format("MMM D");
                        var year = moment(today).format("YYYY");
                        this.setState({today : start.valueOf(),
                            startOfWeek: start,
                            endOfWeek: end,
                            year: year})
                    }}>
                <ChevronRight />
            </Button>
        </div>);
    }

    renderDays() {
        const { classes } = this.props;

        return (<div className={classes.daysOfWeekStyle1}>
            {(this.state.daysOfWeek).map(value => (
                <div className={classes.daysOfWeekStyle}>
                    <font size="3" color="black">{value}</font>
                </div>

            ))}
        </div>);
    }

    render() {
        const { classes } = this.props;
        const { visitsMap } = this.state
        return(
            <div className={classes.rootLevelStyle}>
                {this.renderDateStrip()}
                {this.renderDays()}
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
                                classes={{padding: classes.padding}}
                            />
                                {(this.state.userRoleDetailsMap[value.role]).map(user => (
                                    <div>
                                        <VisitListRow name={user.name}
                                                      id={user.id}
                                                      visits={visitsMap}
                                                      classes={classes}/>
                                        <Divider />
                                    </div>
                                ))}

                        </div>)
                })}
            </div>
        );
    }
};
export default withStyles(styles)(SchedulerList);

