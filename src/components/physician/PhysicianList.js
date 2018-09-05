import React from 'react'
import {List, Datagrid, TextField, EditButton} from 'react-admin'
const PhysicianPagination = () => {
  return (
    false
  );
}

export const PhysicianList = (props) => (
  <List {...props} title="List of physicians" pagination={<PhysicianPagination/>} bulkActions={false}>
    <Datagrid>
      <TextField source="npi" label="NPI ID"/>
      <TextField source="firstName" label="First Name"/>
      <TextField source="lastName" label="Last Name"/>
      <TextField source="phone1" label="Office Phone"/>
    </Datagrid>
  </List>
)
