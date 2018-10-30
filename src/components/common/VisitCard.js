import React from 'react'
import moment from "moment/moment";
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Button from '@material-ui/core/Button';

export default class VisitCard extends React.Component{
    render(){
        const { name, classes } = this.props;
        return (
            <div className={classes.paperStyle2}>

                <div><font size="1">J.Smith    1:00 PM</font></div>
                <div><font size="1">P.Jules    --:--</font></div>
                <Button size="small" onClick={() => {

                }}>
                More
                </Button>
            </div>
        );
    }
}
