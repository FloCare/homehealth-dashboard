import React from 'react';
import {List, Datagrid, TextField, EditButton, DeleteButton, CardActions, CreateButton, RefreshButton} from 'react-admin';
import {
    Create, Edit, SimpleForm, TextInput, SelectArrayInput, ReferenceArrayInput,
    LongTextInput, TabbedForm, FormTab, DisabledInput, ReferenceArrayField,
    SingleFieldList, ChipField, ReferenceInput, SelectInput, AutocompleteInput, Pagination, Filter,
    SaveButton, Toolbar, ListButton
} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';
import CreateForm from './PatientCreate';
import EditForm from './PatientEdit';

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

const PatientPagination = () => {
    return (
        false
    );
};

const PatientFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
    </Filter>
);

const PostPagination = props => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />

const PatientActions = withStyles(styles)(({bulkActions, basePath, classes}) => (
    <CardActions>
        <CreateButton basePath={basePath} className={classes.button}/>
        <RefreshButton className={classes.button}/>
    </CardActions>
));

export const PatientList = withStyles(styles)(({ classes, ...props }) => (
    props.options.label = 'Patients',
    <List {...props} title="List of patients" actions={<PatientActions />} pagination={<PostPagination />}
          bulkActions={false}
          sort={{ order: 'ASC' }}
          perPage={10}
          filters={<PatientFilter />}>
        <Datagrid>
            <TextField source="lastName" />
            <TextField source="firstName" />
            <ReferenceArrayField
                        label="Staff" reference="users" source="userIds">
                        <SingleFieldList>
                            <ChipField source="displayname" />
                        </SingleFieldList>
                    </ReferenceArrayField>
            <EditButton className={classes.button}/>
        </Datagrid>
    </List>
));

// const PatientTitle = ({ record }) => {
//     return <span>Patient {record ? `"${record.title}"` : ''}</span>;
// };

const validatePatientCreation = (values) => {
    const errors = {};
    if (!values.firstName) {
        errors.firstName = ['Required'];
    }
    if (!values.lastName) {
        errors.lastName = ['Required'];
    }
    if (!values.address || values.address.length < 6) {
        errors.address = ['The street address has to be selected from the dropdown'];
    }
    var dateOfBirth = values.dateOfBirth;
    if(dateOfBirth) {
        var dob = JSON.stringify(dateOfBirth);
        var dateMonthYearHifenSeparated = dob.substring(1, dob.length -1).split('T');
        var dateArray = dateMonthYearHifenSeparated[0].split('-');
        var date = parseInt(dateArray[2]);
        var month = parseInt(dateArray[1]);
        if(date > 31 || month > 12) {
            errors.dateOfBirth = ['Incorrect date entered'];
        }
    }
    const primaryContact = values.primaryContact;
    const emergencyContactNumber = values.emergencyContactNumber;
    if (!values.primaryContact) {
        errors.primaryContact = ['Required'];
    }
    else if (!primaryContact ||  isNaN(primaryContact)) {
        errors.primaryContact = ['Contact Number can only contain numerics'];
    }
    else if (!primaryContact || primaryContact.length < 10) {
        errors.primaryContact = ['Contact Number incomplete'];
    }
    else if (!primaryContact || primaryContact.length > 10) {
        errors.primaryContact = ['Contact Number too long'];
    }
    return errors
};

const Heading = props => {
    const {text} = props;
    return (
        <div>
            <h4>{text}</h4>
        </div>
    );
};

const Info = props => {
    const {text, style, textColor} = props;
    return (
        <div style={style}>
            <font size="2" color={textColor}>{text}</font>
        </div>
    );
};

// const PatientEditActions = ({ basePath, data, resource }) => (
//     <CardActions>
//         <ShowButton basePath={basePath} record={data} />
//         <ListButton basePath={basePath} />
//         <DeleteButton basePath={basePath} record={data} resource={resource} />
//         <RefreshButton />
//         {/* Add your custom actions */}
//         {/*<Button color="primary" onClick={customAction}>Custom Action</Button>*/}
//     </CardActions>
// );

const PatientEditActions = withStyles(styles)(({ basePath, data, classes }) => (
    <CardActions>
        <ListButton className={classes.button} basePath={basePath} record={data} />
    </CardActions>
));

const PatientCreateToolbar = withStyles(styles)(({ classes, ...props }) => (
    <Toolbar {...props}>
        <SaveButton
            className={classes.button}
            label="Save"
            redirect="list"
            submitOnEnter={true}
        />
    </Toolbar>
));


export const PatientEdit = withStyles(styles)(({ classes, ...props }) => {
    return (
        <Edit title="Edit Patient" actions={<PatientEditActions />} {...props}>
            <EditForm {...props} toolbar={<PatientCreateToolbar/>}/>
        </Edit>
    );
});


export const PatientCreate = withStyles(styles)(({ classes, ...props }) => (
    <Create {...props} title="Add Patient" actions={<PatientEditActions />}>
        <CreateForm {...props} toolbar={<PatientCreateToolbar/>}/>
    </Create>
));