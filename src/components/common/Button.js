import {Button} from 'rmwc/Button'
import React from 'react'

const defaultStyle = {
  backgroundColor: '#7a797c'
}

export default class SimpleButton extends React.Component {
  render () {
    return (
      <Button disabled={this.props.disabled} raised style={{...defaultStyle, ...this.props.style}} onClick={this.props.onClick}>
        {this.props.text}
      </Button>
    )
  }
}
