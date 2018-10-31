import React from 'react'
import VisitCard from './VisitCard'

export default class VisitListRow extends React.Component{
    render(){
        const { name, classes, id, visits } = this.props;
        return (
            <div className={classes.staffStyle}>
                <div className={classes.paperStyle}>
                    <font size="2">{name}</font>
                </div>
                <div className={classes.paperStyle1}>
                    {['28-10-2018', '29-10-2018', '30-10-2018', '31-10-2018', '01-11-2018', '02-11-2018', '03-11-2018'].map(value => {
                        var temp = [];
                        var visitMapKeys = [];
                        var userVisits = [];
                        temp = visits[id];
                        if(temp != undefined) {
                            visitMapKeys = Object.keys(visits[id]);
                        }
                        visitMapKeys.map(id1 => {
                            if(temp[id1][value] != undefined)
                                userVisits.push(temp[id1][value]);

                        })
                        return (<VisitCard date={value}
                                           staff={name}
                                           id={id}
                                           visits={userVisits}
                                           classes={classes}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}
