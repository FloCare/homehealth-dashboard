import React from 'react';
import {List, Datagrid, TextField, EditButton, DeleteButton} from 'react-admin';
import {
    Create, Edit, SimpleForm, TextInput, SelectArrayInput, ReferenceArrayInput,
    LongTextInput, TabbedForm, FormTab, DisabledInput, ReferenceArrayField,
    SingleFieldList, ChipField, ReferenceInput, SelectInput, AutocompleteInput
} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import CreateForm from './PlacesCreate';
import EditForm from './PlacesEdit';

const PlacesPagination = () => {
    return (
        false
    );
};

export const PlacesList = (props) => (
    props.options.label = 'Stops',
    <List {...props} title="List of places" pagination={<PlacesPagination />} bulkActions={false} sort={{ order: 'ASC' }}>
        <Datagrid>
            <TextField source="name" />
            <TextField source="contactNumber" />
            <TextField source="displayAddress" label="Address"/>
            <EditButton />
        </Datagrid>
    </List>
);

const styles = {
    inlineBlock: { display: 'inline-flex', marginRight: '1rem' },
    textStyle: { fontSize: 34, color: 'black', fontWeight: 'bold'}
};


export const PlacesEdit = withStyles(styles)(({ classes, ...props }) => {
    return (
        <Edit title="Edit Place" {...props}>
            <EditForm {...props} />
        </Edit>
    );
});


export const PlacesCreate = withStyles(styles)(({ classes, ...props }) => (
    <Create {...props} title="Add Place">
        <CreateForm {...props} />
    </Create>
));