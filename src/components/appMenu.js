import React from 'react';
import { connect } from 'react-redux';
import {MenuItemLink, getResources} from 'react-admin';
import {withRouter} from 'react-router-dom';
import {Responsive} from 'react-admin';
import PatientIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';
import {MENU_ITEM_USERS, MENU_ITEM_PHI} from '../constants';

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
            } else {
                label = resource.name.charAt(0).toUpperCase() + resource.name.slice(1);
                icon = <UserIcon />;
            }
            return (
                <MenuItemLink to={`/${resource.name}`} primaryText={label} onClick={onMenuClick} leftIcon={icon} />
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