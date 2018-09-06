import {Layout} from 'react-admin';
import appMenu from './appMenu';
import React from 'react';

const appLayout = (props) => <Layout {...props} menu={appMenu} />;

export default appLayout;