import React from 'react';
import {
    TextField, List, Datagrid, ShowButton
} from 'react-admin';

const ViewReports = (props) => {
    return (
        <List {...props} bulkActions={false} title="User Reports List">
            <Datagrid>
                <TextField source="name" label="Name" sortable={false} />
                <TextField source="createdAt" label="Report Created At" sortable={false} />
                <TextField source="updatedAt" label="Report Updated At" sortable={false} />
                <ShowButton />
            </Datagrid>
        </List>
    );
};

export {ViewReports};
