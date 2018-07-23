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
        <SimpleForm validate={validatePatientCreation} redirect="list">
            <Heading text="Basic Details"/>
            <TextInput source="firstName" formClassName={classes.inlineBlock} />
            <TextInput source="lastName" formClassName={classes.inlineBlock} />
            <TextInput source="primaryContact" label="Phone Number" />
            <DateInput source="dateOfBirth" label="DOB (mm-dd-yyyy) (Optional)" 
                options={{ format: 'MM-DD-YYYY', maxDate: '01-01-2018', openToYearSelection: true, disableFuture: true, clearable: true, keyboard: true, mask: [/[0-1]/, /[1-9]/, '-', /[0-3]/, /[0-9]/, '-', /[1-2]/, /\d/, /\d/, /\d/] }} />
            <Heading text="Emergency Contact Details (Optional)"/>
            <TextInput source="emergencyContactName" label="Contact Name" formClassName={classes.inlineBlock} />
            <TextInput source="emergencyContactNumber" label="Phone Number" formClassName={classes.inlineBlock}/>
            <TextInput source="emergencyContactRelationship" label="Relationship" />
            <Heading text="Address Details"/>
            <Field source="address" name="address" component={SearchBar} />
            <TextInput source="apartment_no" label="Apt #, suite, unit, floor (Optional)" styles={{marginBottom: 10}} />
            <Heading text="Physician Team"/>
            <ReferenceInput label="Primary Physician" source="physician_id" reference="physicians">
                <AutocompleteInput optionText="displayname" optionValue="id" />
            </ReferenceInput>
            <Heading text="Care Team" />
            <ReferenceArrayInput label="Staff" source="users" reference="users">
                <SelectArrayInput optionText="displayname" optionValue="id" />
            </ReferenceArrayInput>
            <Info style={{width: '100%', marginTop: 30}} text="Note: Do select the street address from the suggestions" textColor="black" />
        </SimpleForm>
    </Create>
));