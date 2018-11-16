import React from 'react'
import {List, Datagrid, TextField, EditButton, CardActions, CreateButton, RefreshButton} from 'react-admin'
import withStyles from '@material-ui/core/styles/withStyles';

const PhysicianPagination = () => {
  return (
    false
  );
}

const styles = {
    button: {
        // This is JSS syntax to target a deeper element using css selector, here the svg icon for this button
        '& svg': { color: '#64CCC9' },
        color: '#64CCC9'
    },
};

const PhysicianActions = withStyles(styles)(({bulkActions, basePath, classes}) => (
    <CardActions>
        <CreateButton basePath={basePath} className={classes.button}/>
        <RefreshButton className={classes.button}/>
    </CardActions>
));

export const PhysicianList = withStyles(styles)(({ classes, ...props }) => (
  <List {...props} title="List of physicians" actions={<PhysicianActions />} pagination={<PhysicianPagination/>} bulkActions={false}>
    <Datagrid>
      <TextField source="npi" label="NPI ID"/>
      <TextField source="firstName" label="First Name"/>
      <TextField source="lastName" label="Last Name"/>
      <TextField source="phone1" label="Office Phone" sortable={false}/>
        <EditButton className={classes.button}/>
    </Datagrid>
  </List>
));
