import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Dialog from '@material-ui/core/Dialog';
import blue from '@material-ui/core/colors/blue';
import ListSubheader from '@material-ui/core/ListSubheader';

const styles = {
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    root: {
        marginTop: '10px',
        marginBottom: '10px',
        textAlign : 'center'
    },
    root1: {
        marginTop: '10px',
        marginBottom: '2px',
        textAlign : 'center'
    },
    disciplineLabelStyle: {
        lineHeight: '20px',
        fontSize: 12
    },
};

class SimpleDialog extends React.Component {
    handleClose = () => {
        this.props.onClose(this.props.selectedValue);
    };


    render() {
        const { classes, onClose, visits, date, staff, ...other } = this.props;
        var currDate = moment(date, 'DD-MM-YYYY').format('MMM M/D');
        var visitCard = [];
        for (var key in visits) {
            if(visits[key] != undefined) {
                visitCard.push(<div>
                    <List
                        component="nav"
                        dense={false}
                        subheader={<ListSubheader classes={{
                            root: classes.disciplineLabelStyle
                        }} component="div">✓ {visits[key]}</ListSubheader>}
                        classes={{padding: classes.padding}}
                    />
                </div>);
                // visitCard.push(<div className={classes.root}>
                //     <font size="2">✓ {visits[key]}</font>
                // </div>);
            }
        }

        return (
            <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
                <div>
                    <div className={classes.root}>{currDate}</div>
                    <div className={classes.root1}>{staff}</div>
                    <div> ------------------------------</div>
                    {visitCard}
                </div>
            </Dialog>
        );
    }
}

SimpleDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};

const SimpleDialogWrapped = withStyles(styles)(SimpleDialog);

export default SimpleDialogWrapped