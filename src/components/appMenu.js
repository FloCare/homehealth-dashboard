import React from 'react';
import { connect } from 'react-redux';
import {MenuItemLink, getResources} from 'react-admin';
import {withRouter} from 'react-router-dom';
import {Responsive} from 'react-admin';
import PatientIcon from '@material-ui/icons/Book';
import PlaceIcon from '@material-ui/icons/Place';
import UserIcon from '@material-ui/icons/Group';
import SchedulerIcon from '@material-ui/icons/Assignment';
import {MENU_ITEM_USERS, MENU_ITEM_PHI, MENU_ITEM_STOPS, MENU_ITEM_SCHEDULER} from '../utils/constants';

// Todo: 'Responsive' component might need tweaking
const appMenu = ({ resources, onMenuClick, logout }) => (
    <div>
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
            } else if (resource.name === 'scheduler'){
                label = MENU_ITEM_SCHEDULER;
                icon = <SchedulerIcon />;
            } else {
                label = resource.name.charAt(0).toUpperCase() + resource.name.slice(1);
                icon = <UserIcon />;
            }
            return (
                <MenuItemLink key={resource.name} to={`/${resource.name}`} primaryText={label} onClick={onMenuClick} leftIcon={icon} />
            );
        })}
        <Responsive
            small={logout}
            medium={null}
        />
    </div>
);

const mapStateToProps = state => ({
    resources: getResources(state),
});

export default withRouter(connect(mapStateToProps)(appMenu));