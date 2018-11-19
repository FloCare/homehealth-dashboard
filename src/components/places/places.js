import React from 'react';
import {List, Datagrid, TextField, EditButton, DeleteButton} from 'react-admin';
import {
    Create, Edit, SimpleForm, TextInput, SelectArrayInput, ReferenceArrayInput,
    LongTextInput, TabbedForm, FormTab, DisabledInput, ReferenceArrayField,
    SingleFieldList, ChipField, ReferenceInput, SelectInput, AutocompleteInput,
    CardActions, CreateButton, RefreshButton, SaveButton, Toolbar, ListButton
} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import CreateForm from './PlacesCreate';
import EditForm from './PlacesEdit';

const PlacesPagination = () => {
    return (
        false
    );
};

const styles = {
    inlineBlock: { display: 'inline-flex', marginRight: '1rem' },
    textStyle: { fontSize: 34, color: 'black', fontWeight: 'bold'},
    button: {
        // This is JSS syntax to target a deeper element using css selector, here the svg icon for this button
        '& svg': { color: '#64CCC9' },
        color: '#64CCC9',
        backgroundColor: 'transparent'
    },
};

const PlaceActions = withStyles(styles)(({bulkActions, basePath, classes}) => (
    <CardActions>
        <CreateButton basePath={basePath} className={classes.button}/>
        <RefreshButton className={classes.button}/>
    </CardActions>
));

export const PlacesList = withStyles(styles)(({ classes, ...props }) => (
    props.options.label = 'Stops',
    <List {...props} title="List of places" actions={<PlaceActions />} pagination={<PlacesPagination />} bulkActions={false} sort={{ order: 'ASC' }}>
        <Datagrid>
            <TextField source="name" />
            <TextField source="contactNumber" sortable={false}/>
            <TextField source="displayAddress" label="Address" sortable={false}/>
            <EditButton className={classes.button}/>
        </Datagrid>
    </List>
));

const PlaceCreateToolbar = withStyles(styles)(({ classes, ...props }) => (
    <Toolbar {...props}>
        <SaveButton
            className={classes.button}
            label="Save"
            redirect="list"
            submitOnEnter={true}
        />
    </Toolbar>
));

const PlaceCreateActions = withStyles(styles)(({ basePath, data, classes }) => (
    <CardActions>
        <ListButton className={classes.button} basePath={basePath} record={data} />
    </CardActions>
));


const PlaceEditActions = withStyles(styles)(({ basePath, classes, resource }) => (
    <CardActions>
        <ListButton className={classes.button} basePath={basePath} />
        <DeleteButton className={classes.button}/>
        <RefreshButton className={classes.button}/>
    </CardActions>
));


export const PlacesEdit = withStyles(styles)(({ classes, ...props }) => {
    return (
        <Edit title="Edit Place" {...props} actions={<PlaceEditActions/>} >
            <EditForm {...props} toolbar={<PlaceCreateToolbar/>}/>
        </Edit>
    );
});


export const PlacesCreate = withStyles(styles)(({ classes, ...props }) => (
    <Create {...props} title="Add Place" actions={<PlaceCreateActions/>}>
        <CreateForm {...props} toolbar={<PlaceCreateToolbar/>}/>
    </Create>
));