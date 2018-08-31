import React from 'react';
import {
    TextField, List, Datagrid, ShowButton
} from 'react-admin';

const ViewReports = (props) => {
    return (
        <List {...props} bulkActions={false} title="User Reports List (Most Recent First)">
            <Datagrid>
                <TextField source="userName" label="UserName" />
                <TextField source="createdAt" label="Report Created At" />
                <TextField source="updatedAt" label="Report Updated At" />
                <ShowButton />
            </Datagrid>
        </List>
    );
};

export {ViewReports};
