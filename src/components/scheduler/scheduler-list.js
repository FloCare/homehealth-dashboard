
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
import Refresh from '@material-ui/icons/Refresh';
import Button from '@material-ui/core/Button';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import {stringify} from 'query-string';
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
        boxShadow: '5px 5px 15px rgba(0,0,0,0.4)',
        marginTop: '0.1%',
        width: '84vw',
        height: '100%',

    },
    disciplineBkgColor: {
        backgroundColor: '#60BEBC'
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
    paperStyle3: {
        width: '70%',
        float: 'left',
        paddingRight: '0.001vw',
    },
    paperStyle4: {
        width: '30%',
        float: 'left'
    },
    paperStyle2: {
        float: 'left',
        borderLeft: '1px solid grey',
        paddingLeft: '1%',
        height: '10vh',
        width: '9.5vw'
    },
    daysOfWeekStyle1: {
        marginLeft: '8vw',
        whiteSpace: 'noWrap'
    },
    daysOfWeekStyle: {
        position: 'relative',
        display: 'inline',
        marginLeft: '6vw',
    },
    refreshStyle: {
        position: 'relative',
        display: 'inline',
        marginLeft: '15vw',
        whiteSpace: 'noWrap'
    },
    stripStyle: {
        marginLeft: '30vw',
        paddingBottom: '2vh',
        whiteSpace: 'noWrap'
    },
    padding: {
        paddingTop: '0px',
        paddingBottom: '0px'
    },
    visitRowColorStyle: {
        backgroundColor: '#F0F0F0'
    },
    refreshButtonStyle: {
        textTransform: 'none',
        fontSize: 16,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    button: {
        // This is JSS syntax to target a deeper element using css selector, here the svg icon for this button
        '& svg': { color: '#64CCC9' },
        color: '#64CCC9',
        backgroundColor: 'transparent'
    },
    buttonStyle: {
        textTransform: 'none',
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    extendedIcon: {
        marginRight: '1vw',
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
        daysOfWeekFormatted: [],
        userRoleDetailsMap: {},
        visitsMap: {},
        filteredVisitsMap: {},
        duplicateVisitsMap: {},
        checkedMap: {},
        position : null
    };

    componentWillMount() {

        var startOfWeek = moment().startOf('week').format("MMM D");
        var endOfWeek = moment().endOf('week').format("MMM D");
        var defaultWeekdays = Array.apply(null, Array(7)).map(function (_, i) {
            return moment(i, 'e').endOf('week').isoWeekday(i).format('ddd M/D');
        });
        var defaultWeekdaysFormatted = Array.apply(null, Array(7)).map(function (_, i) {
            return moment(i, 'e').endOf('week').isoWeekday(i).format('DD-MM-YYYY');
        });
        var year = moment().year();
        this.setState({startOfWeek : startOfWeek,
                        endOfWeek: endOfWeek,
                        year: year,
                        today: moment().toDate(),
                        daysOfWeek: defaultWeekdays,
                        daysOfWeekFormatted: defaultWeekdaysFormatted})


        var days = [];
        var day = startOfWeek;
        //TODO handle the returned promise
        var userData = this.fetchUsersData();
        var visitData = this.fetchVisitData();
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


    async fetchVisitData() {
        var defaultWeekdaysFormatted = Array.apply(null, Array(7)).map(function (_, i) {
            return moment(i, 'e').endOf('week').isoWeekday(i).format('YYYY-MM-DD');
        });
        var tempVisitsMap = {};
        var startDate = defaultWeekdaysFormatted[0];
        var endDate = defaultWeekdaysFormatted[defaultWeekdaysFormatted.length - 1];
        const request = new Request(VISIT_DATA_API_URL+'?start=' + startDate + '&end=' + endDate, {
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
            for(var i=0; i<resp.length; i++) {
                var plannedStartTime = resp[i].plannedStartTime;
                var midnightEpoch = resp[i].midnightEpoch;
                var formattedDate = moment(parseInt(midnightEpoch)).subtract(moment().utcOffset(), 'minutes').format('DD-MM-YYYY')
                if(resp[i].episode == null)
                    continue;
                var row = resp[i].isDone + '%' + resp[i].episode.patient.name + '$' +
                    (plannedStartTime === null ? '--:--' : moment.utc(plannedStartTime).local().format("HH:mm"));
                var insert = [];
                insert[formattedDate] = row;
                tempVisitsMap[resp[i].userID] = tempVisitsMap[resp[i].userID] || [];
                tempVisitsMap[resp[i].userID].push(insert);

            }
        });

        this.setState({
            visitsMap: tempVisitsMap
        });

    }

    async updateVisitData() {

        const {today} = this.state;
        var defaultWeekdaysFormatted = Array.apply(null, Array(7)).map(function (_, i) {
            return moment(today).endOf('week').isoWeekday(i).format('YYYY-MM-DD');
        });
        var tempVisitsMap = {};
        var startDate = defaultWeekdaysFormatted[0];
        var endDate = defaultWeekdaysFormatted[defaultWeekdaysFormatted.length - 1];
        const request = new Request(VISIT_DATA_API_URL+'?start=' + startDate + '&end=' + endDate, {
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

            for(var i=0; i<resp.length; i++) {
                var plannedStartTime = resp[i].plannedStartTime;
                var midnightEpoch = resp[i].midnightEpoch;
                var formattedDate = moment(parseInt(midnightEpoch)).subtract(moment().utcOffset(), 'minutes').format('DD-MM-YYYY')
                if(resp[i].episode == null)
                    continue;
                var row = resp[i].isDone + '%' + resp[i].episode.patient.name + '$' +
                    (plannedStartTime === null ? '--:--' : moment.utc(plannedStartTime).local().format("HH:mm"));
                var insert = [];
                insert[formattedDate] = row;
                tempVisitsMap[resp[i].userID] = tempVisitsMap[resp[i].userID] || [];
                tempVisitsMap[resp[i].userID].push(insert);

            }
        });
        this.setState({
            visitsMap: tempVisitsMap
        });
    }

    handleRefreshClick = () => {
        this.updateVisitData();
    };

    renderDateStrip() {
        const {startOfWeek, endOfWeek, year, today} = this.state;
        const { classes } = this.props;

        return (<div className={classes.stripStyle}>
            <Button color="#fff" onClick={async() => {
                        var start = moment(today).subtract(1, 'week').startOf('week').format("MMM D");
                        var end = moment(today).subtract(1, 'week').endOf('week').format("MMM D");
                        var year = moment(today).year();
                        var defaultWeekdays = Array.apply(null, Array(7)).map(function (_, i) {
                            return moment(today).subtract(1, 'week').endOf('week').isoWeekday(i).format('ddd M/D');
                        });
                        var defaultWeekdaysFormatted = Array.apply(null, Array(7)).map(function (_, i) {
                            return moment(today).subtract(1, 'week').endOf('week').isoWeekday(i).format('DD-MM-YYYY');
                        });
                        await this.setState({today : moment(today).subtract(1, 'week').toDate(),
                                        startOfWeek: start,
                                        endOfWeek: end,
                                        year: year,
                                        daysOfWeek: defaultWeekdays,
                                        daysOfWeekFormatted: defaultWeekdaysFormatted})
                        this.updateVisitData();

                    }} classes={{
                root: classes.buttonStyle
            }}>
                <ChevronLeft />
            </Button>
            <font size="3" color="black">{startOfWeek} - {endOfWeek}, {year}</font>
            <Button color="#fff" onClick={async() => {
                        var start = moment(today).add(1, 'week').startOf('week').format("MMM D");
                        var end = moment(today).add(1, 'week').endOf('week').format("MMM D");
                        var year = moment(today).format("YYYY");
                        var defaultWeekdays = Array.apply(null, Array(7)).map(function (_, i) {
                            return moment(today).add(1, 'week').endOf('week').isoWeekday(i).format('ddd M/D');
                        });
                        var defaultWeekdaysFormatted = Array.apply(null, Array(7)).map(function (_, i) {
                            return moment(today).add(1, 'week').endOf('week').isoWeekday(i).format('DD-MM-YYYY');
                        });
                        await this.setState({today : moment(today).add(1, 'week').toDate(),
                            startOfWeek: start,
                            endOfWeek: end,
                            year: year,
                            daysOfWeek: defaultWeekdays,
                            daysOfWeekFormatted: defaultWeekdaysFormatted})
                        this.updateVisitData();
                    }} classes={{
                root: classes.buttonStyle
            }}>
                <ChevronRight />
            </Button>
            <div className={classes.refreshStyle}>
            <Button size="small" color="#64CCC9"
                    className={classes.button}
                    classes={{
                root: classes.refreshButtonStyle
            }} onClick={this.handleRefreshClick}>
                <Refresh className={classes.extendedIcon}/>
                Refresh
            </Button>
            </div>
        </div>);
    }

    renderDays() {
        const { classes } = this.props;

        return (<div className={classes.daysOfWeekStyle1}>
            {(this.state.daysOfWeek).map(value => (
                <div className={classes.daysOfWeekStyle}>
                    <font size="2" color="black">{value}</font>
                </div>

            ))}
        </div>);
    }

    render() {
        const { classes } = this.props;
        const { visitsMap, daysOfWeekFormatted } = this.state;
        var flag = 0;
        return(
            <div className={classes.rootLevelStyle}>
                {this.renderDateStrip()}
                {this.renderDays()}
                {(this.state.disciplines).map(value => {
                    const colors = ['#5b8a89', '#50a3b2', '#3987c3', '#dc5723', '#00695c', '#536bff', '#8f70f6'];
                    var randomColor = Math.floor(Math.random() * 7) + 1;
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
                                {(this.state.userRoleDetailsMap[value.role]).map(user => {
                                    if(flag === 0) {
                                        flag = 1;
                                        return (<div>
                                            <VisitListRow name={user.name}
                                                          daysOfWeek={daysOfWeekFormatted}
                                                          id={user.id}
                                                          visits={visitsMap}
                                                          classes={classes}/>
                                            <Divider/>
                                        </div>);
                                    }
                                    else {
                                        flag = 0;
                                        return (<div className={classes.visitRowColorStyle}>
                                            <VisitListRow name={user.name}
                                                          daysOfWeek={daysOfWeekFormatted}
                                                          id={user.id}
                                                          visits={visitsMap}
                                                          classes={classes}/>
                                            <Divider/>
                                        </div>);
                                    }
                                })}

                        </div>)
                })}
            </div>
        );
    }
};
export default withStyles(styles)(SchedulerList);

