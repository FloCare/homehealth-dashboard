import React from 'react'
import VisitCard from './VisitCard'

export default class VisitListRow extends React.Component{
    render(){
        const { name, classes } = this.props;
        return (
            <div className={classes.staffStyle}>
                <div className={classes.paperStyle}>
                    <font size="2">{name}</font>
                </div>
                <div className={classes.paperStyle1}>
                    {[0,1,2,3,4,5,6].map(value => (
                        <VisitCard name={value}
                                   classes={classes}
                        />

                    ))}
                </div>
            </div>
        );
    }
}
