import {Layout} from 'react-admin';
import AppMenu from './appMenu';
import React from 'react';

const appLayout = (props) => <Layout {...props} menu={AppMenu} />;

export default appLayout;