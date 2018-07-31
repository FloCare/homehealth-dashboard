import React from 'react';
import {List, Datagrid, TextField, EditButton, DeleteButton} from 'react-admin';
import {
    Create, Edit, SimpleForm, TextInput, SelectArrayInput, ReferenceArrayInput,
    LongTextInput, TabbedForm, FormTab, DisabledInput, ReferenceArrayField,
    SingleFieldList, ChipField, ReferenceInput, SelectInput, AutocompleteInput
} from 'react-admin';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { DateInput } from 'react-admin-date-inputs';
import SearchBar from './SearchBar';
import {Field} from 'redux-form';
import withStyles from '@material-ui/core/styles/withStyles';
import CreateForm from './CreateForm';
import EditForm from './EditForm';

// import {FetchUsers} from './connectionUtils';
// import LocationSearchInput from './LocationSearchInput';
// import SearchBar from './SearchBar';
// import { Field } from 'redux-form';


const PatientPagination = () => {
    return (
        false
    );
};

export const PatientList = (props) => (
    props.options.label = 'Patients',
    <List {...props} title="List of patients" pagination={<PatientPagination />}>
        <Datagrid>
            <TextField source="firstName" />
            <TextField source="lastName" />
            <ReferenceArrayField
                        label="Staff" reference="users" source="userIds">
                        <SingleFieldList>
                            <ChipField source="displayname" />
                        </SingleFieldList>
                    </ReferenceArrayField>
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

// const PatientFilter = (props) => (
//     <Filter {...props}>
//         <TextInput label="Search" source="q" alwaysOn />
//         <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
//             <SelectInput optionText="name" />
//         </ReferenceInput>
//     </Filter>
// );

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
    var today = new Date().toISOString().slice(0,10); 
    if(dateOfBirth) {
        var dob = JSON.stringify(dateOfBirth);
        var dateMonthYearHifenSeparated = dob.substring(1, dob.length -1).split('T');
        var dateArray = dateMonthYearHifenSeparated[0].split('-');
        var todayDateArray = today.split('-');
        var date = parseInt(dateArray[2]);
        var month = parseInt(dateArray[1]);
        var year = parseInt(dateArray[0]);
        if(year > parseInt(todayDateArray[0])) {
            errors.dateOfBirth = ['Incorrect date entered'];
        }
        else if(year == parseInt(todayDateArray[0]) && month > parseInt(todayDateArray[1])) {
            errors.dateOfBirth = ['Incorrect date entered'];
        }
        else if(year == parseInt(todayDateArray[0]) && month == parseInt(todayDateArray[1]) && date >= parseInt(todayDateArray[2])) {
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

const styles = {
    inlineBlock: { display: 'inline-flex', marginRight: '1rem' },
    textStyle: { fontSize: 34, color: 'black', fontWeight: 'bold'}
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


export const PatientEdit = withStyles(styles)(({ classes, ...props }) => {
    console.log('Props inside of PatientEdit are:', props);
    return (
        <Edit title="Edit Patient" {...props}>
            <EditForm {...props} />
        </Edit>
    );
});


export const PatientCreate = withStyles(styles)(({ classes, ...props }) => (
    <Create {...props} title="Create Patient">
        <CreateForm {...props} />
    </Create>
));