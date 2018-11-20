import React from 'react';
import {
    TextField, List, Datagrid, ShowButton, ReferenceField, RefreshButton,CardActions
} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';

// const ReportTitle = (props) => {
//     const record = null;
//     console.log('props inside title:', props);
//     return <span>Reports {record ? `"${record.userName}"` : ''}</span>;
// };

const styles = {
    button: {
        // This is JSS syntax to target a deeper element using css selector, here the svg icon for this button
        '& svg': { color: '#64CCC9' },
        color: '#64CCC9',
        backgroundColor: 'transparent'
    },
};

const ReportActions = withStyles(styles)(({bulkActions, basePath, classes}) => (
    <CardActions>
        <RefreshButton className={classes.button}/>
    </CardActions>
));

const ViewReports = withStyles(styles)((props) => {
    return (
        <List {...props} bulkActions={false} actions={<ReportActions />} title="User Reports">
            <Datagrid>
                <TextField source="name" label="User Name" sortable={false} />
                <TextField source="reportName" label="Report Name" sortable={false} />
                <TextField source="itemCount" label="Number of Visits" sortable={false} />
                <TextField source="updatedAt" label="Report Updated At" sortable={false} />
                <ShowButton className={props.classes.button}/>
            </Datagrid>
        </List>
    );
});

export {ViewReports};
