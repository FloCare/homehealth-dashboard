import {Button} from 'rmwc/Button'
import React from 'react'

const defaultStyle = {
  backgroundColor: '#3700B3'
}

export default class SimpleButton extends React.Component {
  render () {
    return (
      <Button raised style={{...defaultStyle, ...this.props.style}} onClick={this.props.onClick}>
        {this.props.text}
      </Button>
    )
  }
}
