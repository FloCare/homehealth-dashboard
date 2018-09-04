import React from 'react';
import {
    TextField, List, Datagrid, ShowButton, ReferenceField
} from 'react-admin';

// const ReportTitle = (props) => {
//     const record = null;
//     console.log('props inside title:', props);
//     return <span>Reports {record ? `"${record.userName}"` : ''}</span>;
// };

const ViewReports = (props) => {
    return (
        <List {...props} bulkActions={false} title="User Reports">
            <Datagrid>
                <TextField source="name" label="User Name" sortable={false} />
                <TextField source="reportName" label="Report Name" sortable={false} />
                <TextField source="itemCount" label="Number of Visits" sortable={false} />
                <TextField source="updatedAt" label="Report Updated At" sortable={false} />
                <ShowButton />
            </Datagrid>
        </List>
    );
};

export {ViewReports};
