import axios from "axios";
import React, { Component } from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import TextInput from "grommet/components/TextInput";

import { connect } from "react-redux";
import { formDataChange } from "../../../../../../actions/draftItem";
import { fromJS } from "immutable";

import Spinning from "grommet/components/icons/Spinning";
import ReadOnlyText from "./ReadOnlyText";

class TextWidget extends Component {
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
      suggestions: [],
      showSpinner: false
    };
  }

  // TOFIX onBlur, onFocus
  _onChange = _ref => {
    let value = _ref.target.value;

    return this.props.onChange(value !== "" ? value : undefined);
  };

  _replace_hash_with_current_indexes = path => {
    let indexes = this.props.id.split("_").filter(item => !isNaN(item)),
      index_cnt = 0;

    return path.map(item => {
      item = item === "#" ? indexes[index_cnt] : item;
      if (!isNaN(item)) ++index_cnt;
      return item;
    });
  };

  updateSuggestions = event => {
    let suggestions = this.props.options.suggestions,
      data = fromJS(this.props.formData),
      params = this.props.options.params;
    // indexes = this.props.id.split("_").filter(item => !isNaN(item));

    if (params) {
      for (let param in params) {
        let path = params[param];

        // replace # with current input path
        path = this._replace_hash_with_current_indexes(path);

        suggestions = suggestions.replace(
          `${param}=`,
          `${param}=${data.getIn(path)}`
        );
      }
    }

    axios.get(`${suggestions}${event.target.value}`).then(({ data }) => {
      this.setState({
        suggestions: data
      });
    });

    return this.props.onChange(event.target.value);
  };

  updateValueOnSuggestion = ({ suggestion }) => {
    this.autoFillOtherFields();
    return this.props.onChange(suggestion);
  };

  autoFillOtherFields = event => {
    let url = this.props.options.autofill_from,
      fieldsMap = this.props.options.autofill_fields,
      formData = fromJS(this.props.formData);

    let { target: value } = event;
    if (!value) return;

    this.setState({
      showSpinner: true
    });

    axios.get(`${url}${value}`).then(({ data }) => {
      this.setState({
        showSpinner: false
      });
      if (Object.keys(data).length !== 0) {
        let _data = fromJS(data);
        fieldsMap.map(el => {
          let source = el[0],
            destination = el[1];

          // replace # with current path
          destination = this._replace_hash_with_current_indexes(destination);

          formData = formData.setIn(destination, _data.getIn(source));
        });
        this.props.formDataChange(formData.toJS());
      }
    });
  };

  // initiate ORCID search on Enter
  _searchOnEnter = event => {
    if (event.keyCode === 13) {
      this.autoFillOtherFields();
    } else {
      this.props.onKeyDown;
    }
  };

  render() {
    return !this.props.readonly ? (
      <Box flex={true} pad={this.props.pad || { horizontal: "medium" }}>
        <Box flex={true} direction="row">
          <Box full={{ horizontal: true }}>
            <TextInput
              id={this.props.id}
              name={this.props.id}
              placeHolder={this.props.placeholder}
              onDOMChange={this._onChange}
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
              onKeyDown={this._searchOnEnter}
              value={this.props.value || ""}
            />
          </Box>
          {this.state.showSpinner ? (
            <Box align="end">
              <Spinning size="small" />
            </Box>
          ) : null}
        </Box>
      </Box>
    ) : (
      <ReadOnlyText value={this.props.value} />
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
    formData: state.draftItem.get("formData")
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
