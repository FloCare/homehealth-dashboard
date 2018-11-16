import React from 'react'
import Button from '@material-ui/core/Button';
import SimpleDialogWrapped from '../common/SimpleDialog'

export default class VisitCard extends React.Component{

    state = {
        open: false,
    };

    handleClickOpen = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = value => {
        this.setState({ open: false });
    };

    render(){
        const { date, staff, classes, id, visits } = this.props;
        var visitMapKeys = Object.keys(visits);
        var visitSize = visitMapKeys.length;
        var count = 0;
        var visitCard = [];
        for (var key in visits) {
            count++;
            if(count > 2) {
                visitCard.push(<div>
                    <Button size="small" classes={{
                        root: classes.buttonStyle
                    }} onClick={this.handleClickOpen}>
                        {visitSize - 2} More..
                    </Button>
                    <SimpleDialogWrapped
                        date={date}
                        staff={staff}
                        visits={visits}
                        open={this.state.open}
                        onClose={this.handleClose}
                    />
                </div>);
                break;
            }
            else {
                if(visits[key] != undefined) {
                    var res = visits[key].split("$");
                    var patientDetails = res[0].split("%");
                    var patDet = patientDetails[1].split(" ");
                    if(patientDetails[0] === 'true') {
                        // Show only the first six characters of the last name
                        visitCard.push(<div>
                            <div className={classes.paperStyle3}>
                                <font size="2" color="#2196f3">✓ </font>
                                <font size="2">
                                    {patDet[1].charAt(0) + '.' + (patDet[0].length > 6 ? (patDet[0].substring(0, 5) + '..'): patDet[0])}
                                </font>
                            </div>
                            <div className={classes.paperStyle4}>
                                <font size="2">{res[1]}</font>
                            </div>
                        </div>);
                    }
                    else {
                        // Show only the first six characters of the last name
                        visitCard.push(<div>
                            <div className={classes.paperStyle3}>
                                <font size="2" color="#C00000">☓ </font>
                                <font size="2">
                                    {patDet[1].charAt(0) + '.' + (patDet[0].length > 6 ? (patDet[0].substring(0, 5) + '..'): patDet[0])}
                                </font>
                            </div>
                            <div className={classes.paperStyle4}>
                                <font size="2">{res[1]}</font>
                            </div>
                        </div>);
                    }
                }
            }
        }

        return (
            <div className={classes.paperStyle2}>
                {visitCard}
            </div>
        );
    }
}
