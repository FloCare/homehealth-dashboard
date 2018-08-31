import React, {Component} from 'react';
import {
    Show, SimpleShowLayout, TextField, ReferenceInput, AutocompleteInput,
    List, Datagrid, ArrayField, SingleFieldList, ChipField
} from 'react-admin';
import Modal from '@material-ui/core/Modal';
import {withStyles} from '@material-ui/core/styles';
import {push} from 'react-router-redux';

const styles = theme => ({
    tableStyle: {
        width: 'max-content'
    },
    modalStyle: {
        // top: '25%',
        // left: '25%',
        position: 'absolute',
        // width: theme.spacing.unit * 50,
        width: 'max-content',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        // width: 300,
        // height: 300,
        // position: 'absolute',
        // left: '50%',
        // top: '50%',
        // marginLeft: '-150px',
        // marginTop: '-150px',
    },
    headerRow: {
        backgroundColor: '#ccc',
    },
    cellRow: {
        backgroundColor: '#ccc',
    }
});

const ModalComponent = (props) => {
    const childWithProp = React.Children.map(props.children, (child) => {
        return React.cloneElement(child, {record: props.record});
    });
    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
        >
            {childWithProp[0]}
        </Modal>
    );
};

const CustomShowLayout = (props) => {
    return (
        <SimpleShowLayout className={props.className} record={props.record}>
            {props.children}
        </SimpleShowLayout>
    );
};


class ShowReport extends Component{
    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: true
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    // Todo: Open the entire show component inside a modal
    render(){
        return (
            <Show {...this.props}>
                <ModalComponent open={this.state.modalIsOpen} onClose={this.closeModal}>
                    <CustomShowLayout {...this.props} className={this.props.classes.modalStyle}>
                        <TextField source="id" className={this.props.classes.headerRow} />
                        <TextField source="userName" className={this.props.classes.headerRow} />
                        <ArrayField source="visits">
                            <Datagrid className={this.props.classes.tableStyle}>
                                <TextField source="patientName" label="Patient Name" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.cellRow} />
                                <TextField source="address" label="Address" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.cellRow} />
                                <TextField source="odometerStart" label="Odometer Start Reading" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.cellRow} />
                                <TextField source="odometerEnd" label="Odometer End Reading" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.cellRow} />
                                <TextField source="milesComment" label="Comments" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.cellRow} />
                                <TextField source="totalMiles" label="Total Miles Travelled" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.cellRow} />
                            </Datagrid>
                        </ArrayField>
                    </CustomShowLayout>
                </ModalComponent>
            </Show>
        );
    }
}

export default withStyles(styles)(ShowReport);
