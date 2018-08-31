import React, {Component} from 'react';
import {
    Show, SimpleShowLayout, TextField, ReferenceInput, AutocompleteInput,
    List, Datagrid, ArrayField, SingleFieldList, ChipField, ShowButton, EditButton
} from 'react-admin';

// Modal Properties
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '25%'
    }
};


const ViewReports = (props) => {
    console.log('============================================');
    console.log('View Reports re-render');
    console.log('===========================================');
    // console.log('props = ', props);
    return (
        <List {...props} bulkActions={false}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="userName" />
                <TextField source="createdAt" />
                <TextField source="updatedAt" />
                <ShowButton />
                <EditButton />
            </Datagrid>
        </List>
    );
};

export {ViewReports};
