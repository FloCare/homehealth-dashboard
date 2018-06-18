import React from 'react';
import {Edit, DisabledInput, ReferenceArrayInput, SimpleForm, SelectArrayInput, ChipField, ArrayInput, SimpleFormIterator, TextInput,
    // CardActions,
    // ListButton,
    // ShowButton,
    // DeleteButton,
    // RefreshButton,
} from 'react-admin';

const Heading = props => {
    const {text} = props;
    return (
        <div>
            <h4>{text}</h4>
        </div>
    );
};

const Info = props => {
    const {text, style} = props;
    return (
        <div style={style}>
            <font size="2" color="red">{text}</font>
        </div>
    );
};

const PatientTitle = ({ record }) => {
    return <span>{record ? `${record.firstName}` : 'Patient'}</span>;
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


class PatientEdit extends React.Component {
    render() {
        const props = {...this.props};
        // console.log('Props inside of PatientEdit are:',props);
        return (
            <Edit
                {...props}
                // title={<PatientTitle />}
                title="Edit Patient"
                // actions={<PatientEditActions/>}
            >
                <SimpleForm>
                    <Heading text="Basic Details" />
                    <DisabledInput source="firstName" style={{ width: 250, display: 'inline-block' }} />
                    <DisabledInput source="lastName"  style={{ width: 250, display: 'inline-block' }}/>
                    <DisabledInput source="primaryContact" />
                    <Heading text="Care Team"/>
                    <ReferenceArrayInput label="Users" source="userIds" reference="users">
                        <SelectArrayInput optionText="username" optionValue="id" />
                    </ReferenceArrayInput>
                </SimpleForm>
            </Edit>
        );
    }
}

export default PatientEdit;
