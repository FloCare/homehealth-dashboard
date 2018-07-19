import React from 'react'
import {List, Datagrid, TextField, EditButton} from 'react-admin'
const PhysicianPagination = () => {
  return (
    false
  );
}

export const PhysicianList = (props) => (
  <List {...props} title="List of physicians" pagination={<PhysicianPagination/>}>
    <Datagrid>
      <TextField source="npi" label="NPI ID"/>
      <TextField source="first_name" label="First Name"/>
      <TextField source="last_name" label="Last Name"/>
      <TextField source="phone1" label="Office Phone"/>
      <TextField source="phone2" label="Alternate Number"/>
      <EditButton/>
    </Datagrid>
  </List>
)
