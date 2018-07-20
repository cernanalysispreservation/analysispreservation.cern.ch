import axios from "axios";
import React from "react";
import PropTypes from "prop-types";

import { Box, TextInput } from "grommet";
import { connect } from "react-redux";
import { formDataChange } from "../../../../../../actions/drafts";
import { fromJS } from "immutable";

class TextWidget extends React.Component {
  /* To use suggestions, add in options file for your schema, e.g
     * "my_field": {
     *       "ui:options":{
     *           "suggestions": "/api/lhcb/analysis?query="
     *        }
     * }
     * input value will be appended to url
     *
     * To autofill other fields, specify url and fields map,
     * as an array of pairs [from, to], where both are arrays with full paths to fields, e.g
     * "my_field": {
     *       "ui:options":{
     *         "autofill_from": "/api/lhcb/analysis/details?title=",
     *         "autofill_fields": [
     *             [["measurement", "measurement_detail"],["basic_info", "measurement", 0]],
     *             [["another_field_from"],["field_name", "status_field"]],
     *         ]
     *     }
     * }
     * input value will be appended to url
     *
     * IMPORTANT !
     * if you want to refer to the same element of array, that input is in, refer to it by "#", e.g
     * input is basic_info.analysis_proponents[2].name
     * if you want to add orcid for the same object in analysis_proponents you refer to it by
     * ["basic_info", "analysis_proponents", "#", "orcid"]
     */
  constructor() {
    super();
    this.state = {
      suggestions: []
    };
  }

  // TOFIX onBlur, onFocus
  _onChange = _ref => {
    let value = _ref.target.value;
    return this.props.onChange(value);
  };

  updateSuggestions = event => {
    axios
      .get(`${this.props.options.suggestions}${event.target.value}`)
      .then(({ data }) => {
        this.setState({
          suggestions: data
        });
      });

    return this.props.onChange(event.target.value);
  };

  updateValueOnSuggestion = ({ suggestion }) => {
    return this.props.onChange(suggestion);
  };

  autoFillOtherFields = event => {
    let url = this.props.options.autofill_from,
      fieldsMap = this.props.options.autofill_fields,
      formData = fromJS(this.props.formData),
      indexes = this.props.id.split("_").filter(item => !isNaN(item));

    axios.get(`${url}${event.target.value}`).then(({ data }) => {
      if (Object.keys(data).length !== 0) {
        let _data = fromJS(data);
        fieldsMap.map(el => {
          let source = el[0],
            destination = el[1];
          // autofill indexes to match current input path
          destination = destination.map(
            item => (item === "#" ? indexes.pop() : item)
          );
          formData = formData.setIn(destination, _data.getIn(source));
        });
        this.props.formDataChange(formData.toJS());
      }
    });
  };

  render() {
    return (
      <Box flex={true} pad={this.props.pad || { horizontal: "medium" }}>
        <TextInput
          id={this.props.id}
          name={this.props.id}
          placeHolder={this.props.placeholder}
          onDOMChange={this._onChange}
          {...(this.props.readonly
            ? {
                readOnly: "true"
              }
            : {})}
          {...(this.props.autofocus
            ? {
                autoFocus: "true"
              }
            : {})}
          {...(this.props.options && this.props.options.suggestions
            ? {
                suggestions: this.state.suggestions,
                onDOMChange: this.updateSuggestions,
                onSelect: this.updateValueOnSuggestion
              }
            : {})}
          {...(this.props.options && this.props.options.autofill_from
            ? {
                onBlur: this.autoFillOtherFields
              }
            : {})}
          onKeyDown={this.props.onKeyDown}
          value={this.props.value || ""}
        />
      </Box>
    );
  }
}

TextWidget.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  id: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.object,
  placeholder: PropTypes.string,
  formData: PropTypes.object,
  formDataChange: PropTypes.func,
  pad: PropTypes.string,
  readonly: PropTypes.bool,
  autofocus: PropTypes.bool,
  onKeyDown: PropTypes.func
};

function mapStateToProps(state) {
  return {
    formData: state.drafts.getIn(["current_item", "formData"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    formDataChange: data => dispatch(formDataChange(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextWidget);
