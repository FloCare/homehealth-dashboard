import React from 'react';
import { connect } from 'react-redux';
import {MenuItemLink, getResources} from 'react-admin';
import { withStyles } from '@material-ui/core/styles';
import {withRouter} from 'react-router-dom';
import {Responsive} from 'react-admin';
import Collapse from '@material-ui/core/Collapse';
import PatientIcon from '@material-ui/icons/Book';
import PlaceIcon from '@material-ui/icons/Place';
import UserIcon from '@material-ui/icons/Group';
import SchedulerIcon from '@material-ui/icons/Assignment';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {MENU_ITEM_USERS, MENU_ITEM_PHI, MENU_ITEM_STOPS, MENU_ITEM_SCHEDULER} from '../utils/constants';

const styles = {
    listItemDefaultStyle: {
        paddingTop: '1vh',
        height: '5vh',
    },
    listItemButtonStyle: {
        '&:hover': {
            textDecoration: 'none',
            backgroundColor: 'none',
        }
    },
    listItemTextStyle: {
        padding: '0vw',
    },
    menuItemLinkStyle: {
        paddingLeft: '4vw',
    },
    inset: {
        '&:first-child': {
            paddingLeft: '0vw'
        }
    },
    listItemNestedStyle: {
        paddingLeft: '1vw',
        paddingTop: '1.5vw',
        paddingBottom: '1.5vw',
    },
};

class AppMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        open: false,
    };

    handleClick = () => {
        this.setState(state => ({ open: !state.open }));
    };

    render() {
        const {resources, onMenuClick, logout, classes} = this.props;
        return (<div>
            {resources.filter(resource => resource.name !== 'reports').map(resource => {
                let label = '';
                let icon = '';
                if (resource.name === 'phi'){
                    label = MENU_ITEM_PHI;
                    icon = <PatientIcon />;
                } else if (resource.name === 'users'){
                    label = MENU_ITEM_USERS;
                    icon = <UserIcon />;
                } else if (resource.name === 'stops'){
                    label = MENU_ITEM_STOPS;
                    icon = <PlaceIcon />;
                } else if (resource.name === 'physicians'){
                    label = resource.name.charAt(0).toUpperCase() + resource.name.slice(1);
                    icon = <UserIcon />;
                } else if (resource.name === 'scheduler'){
                    label = MENU_ITEM_SCHEDULER;
                    icon = <SchedulerIcon />;
                    return (<div>
                        <ListItem button disableGutters={true} onClick={this.handleClick} classes={{
                            root: classes.listItemTextStyle,
                            default: classes.listItemDefaultStyle,
                            button: classes.listItemButtonStyle
                        }} className={classes.listItemNestedStyle}>
                            <ListItemIcon>
                                <SchedulerIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Scheduler" classes={{
                                inset: classes.inset,
                                root: classes.listItemTextStyle,
                            }}/>
                            {this.state.open ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <MenuItemLink
                                    key="scheduler"
                                    to="/scheduler"
                                    primaryText="Map"
                                    onClick={onMenuClick}
                                    classes={{
                                        root: classes.menuItemLinkStyle
                                    }}
                                />
                                <MenuItemLink
                                    key="list"
                                    to="/list"
                                    primaryText="List"
                                    onClick={onMenuClick}
                                    classes={{
                                        root: classes.menuItemLinkStyle
                                    }}
                                />
                            </List>
                        </Collapse>
                    </div>);

                }
                return (
                    <MenuItemLink key={resource.name} to={`/${resource.name}`} primaryText={label} onClick={onMenuClick} leftIcon={icon} />
                );
            })}
            <Responsive
                small={logout}
                medium={null}
            />
        </div>);
    }

}

const mapStateToProps = state => ({
    resources: getResources(state),
});

AppMenu = withStyles(styles)(AppMenu);

export default withRouter(connect(mapStateToProps)(AppMenu));