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
import {CSVLink} from 'react-csv';
import styles from './styles';
import SimpleButton from '../common/Button';

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

const FreeTextField = withStyles(styles)(({classes, ...props}) => (
    <TextField className={classes.freeTextStyle} {...props} />
));

const TotalMilesField = withStyles(styles)(({classes, ...props}) => {
    const {record, source, label} = props;
    return (
        <div className={classes.totalMilesDivStyle}>
            <p><span>{label}:</span> {record[source]}</p>
        </div>
    );
});


class DownloadCSV extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: '',
            reportName: ''
        };
    }

    componentWillReceiveProps (nextProps, nextState){
        let data = '';
        let reportName = '';
        if(nextProps.record){
            reportName = `${nextProps.record.userName}-${nextProps.record.reportName}.csv`;
            const visits = nextProps.record.visits;
            const totalMilesTravelled = nextProps.record.totalMilesTravelled;

            data = [['Name', 'Visit Date', 'Address', 'Odometer Start', 'Odometer End', 'Total Miles', 'Comments'],];
            if(visits){
                visits.forEach((item) => {
                    data.push([item.name, item.dateOfVisit, item.address, item.odometerStart, item.odometerEnd, item.totalMiles, item.milesComments]);
                });
            }
            data.push(['','','','','',totalMilesTravelled,'']);
        }
        this.setState({data, reportName});
    }

    render(){
        return (
            <div className={this.props.className}>
                <CSVLink data={this.state.data} filename={this.state.reportName} style={{color: '#fff', fontSize: 12, textDecoration: 'none'}}>
                    <SimpleButton text="Download Report" style={{borderRadius: 20, padding: 10}}/>
                </CSVLink>
            </div>
        );
    }
}


class ShowReport extends Component{
    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: true,
            csvData: ''
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
                        <DownloadCSV className={this.props.classes.buttonDivStyle} record={this.props.record} />
                        <ArrayField source="visits" label="" className={this.props.classes.container}>
                            <Datagrid>
                                <TextField source="name" label="Name" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.cellRow} sortable={false} />
                                <TextField source="dateOfVisit" label="Visit Date" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.cellRow} sortable={false}/>
                                <FreeTextField source="address" label="Address" sortable={false} headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.freeTextContainerStyle} />
                                <TextField source="odometerStart" label="Odometer Start Reading" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.cellRow} sortable={false}/>
                                <TextField source="odometerEnd" label="Odometer End Reading" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.cellRow} sortable={false}/>
                                <TextField source="totalMiles" label="Miles Travelled" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.cellRow} sortable={false}/>
                                <FreeTextField source="milesComments" label="Comments" headerClassName={this.props.classes.headerRow} cellClassName={this.props.classes.freeTextContainerStyle} sortable={false}/>
                            </Datagrid>
                        </ArrayField>
                        <TotalMilesField source="totalMilesTravelled" label="Total Miles Travelled"/>
                    </CustomShowLayout>
                </ModalComponent>
            </Show>
        );
    }
}

export default withStyles(styles)(ShowReport);
