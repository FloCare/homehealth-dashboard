import React from 'react'
import Button from '@material-ui/core/Button';
import SimpleDialogWrapped from '../common/SimpleDialog'

export default class VisitCard extends React.Component{

    state = {
        open: false,
    };

    renderInputField(visitKeys) {
        if(visitKeys.size > 2) {
            return (                <Button size="small" onClick={() => {

            }}>
                More
            </Button>);
        }
    }

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
            if(count > 3) {
                visitCard.push(<div>
                    <Button size="small" onClick={this.handleClickOpen}>
                        {visitSize - 3} More..
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
                    visitCard.push(<div>
                        <font size="2">✓ {visits[key]}</font>
                    </div>);
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
