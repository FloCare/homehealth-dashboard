import React, {Component} from 'react';
import {
    Show, SimpleShowLayout, TextField, ReferenceInput, AutocompleteInput,
    List, Datagrid, ArrayField, SingleFieldList, ChipField
} from 'react-admin';
import Modal from '@material-ui/core/Modal';
import {withStyles} from '@material-ui/core/styles';
import {push} from 'react-router-redux';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
    container: {
        textAlign: 'center',
    },
    textField: {
        textAlign: 'center',
        fontSize: 25
    },
    freeTextContainerStyle: {
        width: '15%',
        wordBreak: 'break-word'
    },
    freeTextStyle: {
        fontSize: 15
    },
    buttonDivStyle: {
        float: 'right'
    },
    modalStyle: {
        top: '10%',
        left: '10%',
        right: '10%',
        bottom: '10%',
        position: 'absolute',
        // width: theme.spacing.unit * 50,
        width: '80%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        container: {
            display: 'flex',
        },
        overflowY: 'auto',
    },
    headerRow: {
        color: '#2196f3',
        fontSize: 16
    },
    cellRow: {
        fontSize: 15,
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
    // if(props.record && props.record.userName){
    console.log('record is NOT null:', props.record);
    return (
        <SimpleShowLayout className={props.className} record={props.record}>
            {props.children}
        </SimpleShowLayout>
    );
    // } else {
    //     console.log('record is empty:', props.record);
    //     // Todo: Differentiate between loading and data empty case ??
    //     // Todo: Add close button here as well
    //     // Todo: Fix styling for modal in empty case
    //     return (
    //         <SimpleShowLayout className={props.className} record={props.record}>
    //             <div>
    //                 <h2 className={props.container}>
    //                     Loading data for the report ...
    //                 </h2>
    //             </div>
    //         </SimpleShowLayout>
    //     );
    // }
};

const FreeTextField = withStyles(styles)(({classes, ...props}) => (
    <TextField className={classes.freeTextStyle} {...props} />
));

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
        this.props.history.goBack();
    }

    // Todo: Open the entire show component inside a modal
    render(){
        return (
            <Show {...this.props} direction="row" justify="center">
                <ModalComponent open={this.state.modalIsOpen} onClose={this.closeModal}>
                    <CustomShowLayout {...this.props} className={this.props.classes.modalStyle}>
                        <div onClick={this.closeModal} className={this.props.classes.buttonDivStyle}>
                            <IconButton aria-label="Close" color="secondary">
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <TextField source="title" label="" className={this.props.classes.textField} />
                        <ArrayField source="visits" label="" className={this.props.classes.container}>
                            <Datagrid>
                                <TextField source="name" label="Name" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.cellRow} sortable={false} />
                                <FreeTextField source="address" label="Address" sortable={false} headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.freeTextContainerStyle} />
                                <TextField source="odometerStart" label="Odometer Start Reading" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.cellRow} sortable={false}/>
                                <TextField source="odometerEnd" label="Odometer End Reading" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.cellRow} sortable={false}/>
                                <TextField source="totalMiles" label="Total Miles Travelled" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.cellRow} sortable={false}/>
                                <FreeTextField source="milesComments" label="Comments" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.freeTextContainerStyle} sortable={false}/>
                            </Datagrid>
                        </ArrayField>
                    </CustomShowLayout>
                </ModalComponent>
            </Show>
        );
    }
}

export default withStyles(styles)(ShowReport);
