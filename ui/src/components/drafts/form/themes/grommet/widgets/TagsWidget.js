import React, { Component } from "react";
import PropTypes from "prop-types";

import { Box, Toast } from "grommet";

import TagsInput from "react-tagsinput";

import "../../../../../../styles/cap-react-tags.scss";

class TagsWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      errors: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(tags) {
    this.setState({ tags });
    return this.props.onChange(tags);
  }

  renderInput(props) {
    let { onChange, value, ...other } = props;
    return (
      <Box direction="row" flex={true} align="start">
        <Box size="medium">
          <input
            type="text"
            style={{ border: "none" }}
            onChange={onChange}
            value={value}
            {...other}
          />
        </Box>
      </Box>
    );
  }

  onValidationReject = errors => this.setState({ errors: errors });

  clearError = () => {
    this.setState({ errors: [] });
  };

  render() {
    let TAGS_REGEX = this.props.options.pattern;
    return (
      <Box>
        {this.state.errors && this.state.errors.length > 0 ? (
          <Toast status="critical" onClose={() => this.clearError()}>
            {this.state.errors} is not a valid url. Please provide a valid
            <strong>Github</strong> or <strong>Gitlab CERN</strong> url.
          </Toast>
        ) : null}
        <TagsInput
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
          addOnPaste={true}
          validationRegex={TAGS_REGEX}
          onValidationReject={this.onValidationReject}
        />
      </Box>
    );
  }
}

TagsWidget.propTypes = {
  options: PropTypes.object,
  tags: PropTypes.array,
  placeholder: PropTypes.string,
  onChange: PropTypes.func
};

export default TagsWidget;
