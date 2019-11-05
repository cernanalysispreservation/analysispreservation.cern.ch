import React, { Component } from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import cogoToast from "cogo-toast";

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

  showToaster(error) {
    cogoToast.error(
      <div>
        {error} is not a valid url. Please provide a valid{" "}
        <strong>Github</strong> or <strong>Gitlab CERN</strong> url.
      </div>,
      {
        hideAfter: 3
      }
    );
    this.clearError();
  }

  onValidationReject = errors => this.setState({ errors: errors });

  clearError = () => {
    this.setState({ errors: [] });
  };

  render() {
    let TAGS_REGEX = this.props.options.pattern;
    return (
      <Box>
        {this.state.errors && this.state.errors.length > 0
          ? this.showToaster(this.state.errors)
          : null}
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
  onChange: PropTypes.func,
  readonly: PropTypes.bool
};

export default TagsWidget;
