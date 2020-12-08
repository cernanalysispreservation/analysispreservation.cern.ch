import React, { Component } from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";

class TextAreaWidget extends Component {
  constructor(props) {
    super(props);

    if (props.options && props.options.maxChars) {
      this.maxChars = props.options.maxChars;
    }

    this.state = {
      activeLayer: false,
      count: (props.value || "").length
    };
  }

  // TOFIX onBlur, onFocus
  _onChange(_ref) {
    let value = _ref.target.value;
    const length = value.length;

    if (this.maxChars) {
      if (length <= this.maxChars) {
        this.setState({ count: value.length });
        return this.props.onChange(
          value === "" ? this.props.options.emptyValue : value
        );
      }
    } else {
      return this.props.onChange(
        value === "" ? this.props.options.emptyValue : value
      );
    }
  }

  render() {
    return !this.props.readonly ? (
      <textarea
        rows={this.props.options.rows || 3}
        type="text"
        id={this.props.id}
        name={this.props.id}
        onBlur={this.props.onBlur}
        value={this.props.value ? this.props.value : ""}
        onChange={this._onChange.bind(this)}
        style={{ fontSize: "1em", ...this.props.options.style }}
        placeholder={this.props.placeholder}
        maxLength={this.props.options.maxLength}
        minLength={this.props.options.minLength}
        disabled={this.props.options.disabled}
        readOnly={this.props.options.readOnly}
      />
    ) : (
      <Box flex={true} pad={this.props.pad || { horizontal: "medium" }}>
        <Paragraph size="small" margin="none" style={{ color: "#a8a8a8" }}>
          {this.props.value || "empty value from the user"}
        </Paragraph>
      </Box>
    );
  }
}

TextAreaWidget.propTypes = {
  options: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  onBlur: PropTypes.func,
  readonly: PropTypes.bool,
  pad: PropTypes.string,
  placeholder: PropTypes.string
};

export default TextAreaWidget;
