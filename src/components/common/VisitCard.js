import React from 'react'
import Button from '@material-ui/core/Button';

export default class VisitCard extends React.Component{

    renderInputField(visitKeys) {
        if(visitKeys.size > 2) {
            return (                <Button size="small" onClick={() => {

            }}>
                More
            </Button>);
        }
    }

    render(){
        const { date, classes, id, visits } = this.props;
        var visitMapKeys = Object.keys(visits);
        var visitSize = visitMapKeys.length;
        var count = 0;
        var visitCard = [];
        for (var key in visits) {
            count++;
            if(count > 2) {
                visitCard.push(<Button size="small" onClick={() => {

                }}>
                    {visitSize - 2} More..
                </Button>);
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
