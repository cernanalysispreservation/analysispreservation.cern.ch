import React, { Component } from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import TagsInput from "react-tagsinput";

import "../../../../../../styles/cap-react-tags.scss";

class TagsWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      errors: null
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(tags) {
    this.setState({ tags, errors: null });

    let type = this.props.schema.type ? this.props.schema.type : "array";

    if (type == "array") return this.props.onChange(tags);
    else
      return this.props.onChange(
        tags.join(this.props.schema.delimiter || ", ")
      );
  }

  renderInput(props) {
    let {
      onChange,
      value,
      onBlur,
      onFocus,
      onKeyDown,
      onPaste,
      placeholder,
      ref
    } = props;

    // the addTag from props, was causing issues since it is not an attribute for input tag

    return (
      <input
        type="text"
        style={{ border: "none" }}
        onChange={onChange}
        value={value}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        placeholder={placeholder}
        ref={ref}
      />
    );
  }

  onValidationReject = errors => this.setState({ errors: errors });
  render() {
    let TAGS_REGEX = this.props.schema.pattern
      ? new RegExp(this.props.schema.pattern)
      : /.*/;

    return (
      <Box pad={{ horizontal: "medium" }}>
        <TagsInput
          disabled={this.props.readonly}
          value={this.state.tags}
          onChange={this.handleChange}
          className={"cap-react-tagsinput"}
          tagProps={{ className: "cap-react-tagsinput-tag" }}
          inputProps={{
            className: "cap-react-tagsinput-input",
            placeholder: this.props.placeholder
          }}
          renderInput={this.renderInput}
          maxTags={10}
          validationRegex={TAGS_REGEX}
          onValidationReject={this.onValidationReject}
        />
        {this.state.errors ? (
          <Box style={{ color: "red" }}>
            Error values: {this.state.errors.join(", ")}
          </Box>
        ) : null}
      </Box>
    );
  }
}

TagsWidget.propTypes = {
  options: PropTypes.object,
  tags: PropTypes.array,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  schema: PropTypes.object
};

export default TagsWidget;
