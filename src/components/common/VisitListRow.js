import React from 'react'
import VisitCard from './VisitCard'

export default class VisitListRow extends React.Component{
    render(){
        const { name, classes, id, visits, daysOfWeek } = this.props;
        const colors = ['#5b8a89', '#50a3b2', '#3987c3', '#dc5723', '#00695c', '#536bff', '#8f70f6'];
        var randomColor = Math.floor(Math.random() * 7) + 1;
        return (
            <div className={classes.staffStyle}>
                <div className={classes.paperStyle}>
                    <font size="2" color={colors[randomColor]}>{name}</font>
                </div>
                <div className={classes.paperStyle1}>
                    {(daysOfWeek).map(value => {
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
