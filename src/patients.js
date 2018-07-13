import React from 'react';
import {List, Datagrid, TextField, EditButton} from 'react-admin';
import {
    Create, Edit, SimpleForm, TextInput, SelectArrayInput, ReferenceArrayInput,
    LongTextInput, TabbedForm, FormTab, DisabledInput, ReferenceArrayField,
    SingleFieldList, ChipField
} from 'react-admin';
import { DateInput, TimeInput, DateTimeInput } from 'react-admin-date-inputs';
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
    const primaryContact = values.primaryContact;
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
            <TextInput source="firstName" formClassName={classes.inlineBlock} />
            <TextInput source="lastName" formClassName={classes.inlineBlock} />
            <TextInput source="primaryContact" label="Phone Number" />
            <div className="picker">
            <DateInput source="dateOfBirth" label="Date of Birth (Optional)" options={{ format: 'YYYY-MM-DD', disableFuture: true, clearable: true, keyboard: true }} />
            </div>
            <Heading text="Emergency Contact Details"/>
            <TextInput source="emergencyContactName" label="Contact Name (Optional)" formClassName={classes.inlineBlock} />
            <TextInput source="emergencyContactNumber" label="Phone Number (Optional)" formClassName={classes.inlineBlock}/>
            <TextInput source="emergencyContactRelationship" label="Relationship (Optional)" />
            <Heading text="Address Details"/>
            <Field source="address" name="address" component={SearchBar} />
            <TextInput source="apartment_no" label="Apt #, suite, unit, floor (Optional)" styles={{marginBottom: 10}} />
            <Heading text="Care Team" />
            <ReferenceArrayInput label="Staff" source="users" reference="users">
                <SelectArrayInput optionText="displayname" optionValue="id" />
            </ReferenceArrayInput>
            <Info style={{width: '100%', marginTop: 30}} text="Note: Do select the street address from the suggestions" textColor="black" />
        </SimpleForm>
    </Create>
));