import React, { Component } from 'react';

import { Box } from 'grommet';

export class TextAreaWidget extends Component {
  constructor(props) {
    super(props);

    if (props.options && props.options.maxChars) {
      this.maxChars = props.options.maxChars;
    }

    this.state = {
      activeLayer: false,
      count: (props.value || '').length
    }
  }

  // TOFIX onBlur, onFocus
  _onChange(_ref) {
    let value = _ref.target.value;
    const length = value.length;

    if (this.maxChars) {
      if (length <= this.maxChars) {
        this.setState({ count: value.length})
        return this.props.onChange(value === "" ? this.props.options.emptyValue : value);
      }
    }
    else {
      return this.props.onChange(value === "" ? this.props.options.emptyValue : value);
    }
  }

  render() {
    return (
          <Box margin={{horizontal: "medium"}} flex={true}>
            {
              this.maxChars ?
              <Box justify="end" align="end">
                Count: {this.state.count} / {this.maxChars}
              </Box> : null
            }
            <textarea
              rows="5"
              type="text"
              id={this.props.id}
              name={this.props.id}
              onBlur={this.props.onBlur}
              value={this.props.value ? this.props.value : ""}
              onChange={this._onChange.bind(this)} />
          </Box>
    );
  }
}



export default TextAreaWidget;
