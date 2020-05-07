import axios from "axios";
import React, { Component } from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import TextInput from "grommet/components/TextInput";

import { connect } from "react-redux";
import { formDataChange } from "../../../../../../actions/draftItem";
import { fromJS } from "immutable";

import ReadOnlyText from "./ReadOnlyText";
import AsyncSelect from "react-select/async";
import Spinning from "grommet/components/icons/Spinning";

import RegExInput from "./RegExInput";

import debounce from "lodash/debounce";
import ReactTooltip from "react-tooltip";
import CircleQuestionIcon from "grommet/components/icons/base/CircleQuestion";

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
      showSpinner: false,
      error: null,
      autofillSuccess: false
    };
  }

  // TOFIX onBlur, onFocus
  _onChange = _ref => {
    let value = _ref.target.value;

    this.props.onChange(value !== "" ? value : undefined);
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

  updateSuggestions = (value, cb = null) => {
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
          `${param}=${data.getIn(path, "") || ""}`
        );
      }
    }

    axios
      .get(`${suggestions}${value}`)
      .then(({ data }) => {
        if (cb) {
          cb(data.map(value => ({ value, label: value })));
        }
      })
      .catch(err => {
        this.setState({
          error:
            err.response.status !== 500
              ? err.response.data && err.response.data.message
                ? err.response.data.message
                : "Something went wrong with the request "
              : "Something went wrong with the request "
        });
      });
  };

  updateValueOnSuggestion = (suggestion, action) => {
    if (action && action.action == "clear")
      return this.props.onChange(undefined);

    if (!suggestion || !suggestion.value) return;

    if (this.props.options && this.props.options.autofill_from)
      this.autoFillOtherFields();
    return this.props.onChange(suggestion.value);
  };

  autoFillOtherFields = event => {
    let url = this.props.options.autofill_from,
      fieldsMap = this.props.options.autofill_fields,
      formData = fromJS(this.props.formData);

    if (!event.target.value) return;

    fieldsMap.map(el => {
      let destination = el[1];

      // replace # with current path
      destination = this._replace_hash_with_current_indexes(destination);
      formData = formData.setIn(destination, undefined);
    });

    this.setState({ showSpinner: true, error: null });
    axios
      .get(`${url}${event.target.value}`)
      .then(({ data }) => {
        if (Object.keys(data).length !== 0) {
          let _data = fromJS(data);
          fieldsMap.map(el => {
            let source = el[0],
              destination = el[1];

            // replace # with current path
            destination = this._replace_hash_with_current_indexes(destination);
            formData = formData.setIn(destination, _data.getIn(source));
          });
          this.setState({ showSpinner: false });

          this.props.formDataChange(formData.toJS());
          this.setState({ autofillSuccess: true });
        }
      })
      .catch(err => {
        this.setState({
          showSpinner: false,
          error:
            err.response.status !== 500
              ? err.response.data && err.response.data.message
                ? err.response.data.message
                : "Your request was not successful, please try again "
              : "Something went wrong with the request "
        });
      });
  };

  _onEnterAutofill = event => {
    if (event.keyCode === 13) {
      this.autoFillOtherFields(event);
    } else {
      this.props.onKeyDown;
    }
  };

  _renderAutofillButton = (enabled = true) => {
    if (this.props.options && this.props.options.autofill_from) {
      return (
        <Box flex={false} pad={{ horizontal: "small" }}>
          <Box
            onClick={
              enabled
                ? () =>
                    this.autoFillOtherFields({
                      target: { value: this.props.value }
                    })
                : null
            }
            colorIndex={enabled ? "brand" : "grey-2"}
            separator="all"
            direction="row"
            wrap={false}
            justify="center"
            align="center"
            style={{ padding: "3px 5px" }}
          >
            Autofill
            <ReactTooltip />
            <Box
              data-tip={this._renderAutofillTip()}
              data-multiline={true}
              style={{ paddingLeft: "5px" }}
            >
              <CircleQuestionIcon size="xsmall" />
            </Box>
          </Box>
        </Box>
      );
    } else return null;
  };

  _renderAutofillTip() {
    if (this.props.options && this.props.options.autofill_fields) {
      let result =
        "Fetch from remote service and autofill following parts: <br/>";
      this.props.options.autofill_fields.map(field => {
        result += `${field[0].join(" > ")} : ${field[1].join(" > ")} <br/>`;
      });
      return result;
    } else return "Fetch from remote service and autofill parts of the form";
  }

  render() {
    if (this.props.readonly)
      return <ReadOnlyText value={this.props.value} props={this.props} />;

    let input = null;
    if (this.props.options && this.props.options.suggestions) {
      input = (
        <Box className="cap-async-select-input" pad={{ horizontal: "medium" }}>
          <AsyncSelect
            menuPosition="fixed"
            isMulti={false}
            onChange={this.updateValueOnSuggestion}
            onInputChange={this._onInputChange}
            isClearable
            cacheOptions
            backspaceRemovesValue={true}
            escapeClearsValue={true}
            defaultOptions={false}
            value={{ label: this.props.value, value: this.props.value }}
            loadOptions={debounce(this.updateSuggestions, 500)}
          />
        </Box>
      );
    } else if (this.props.schema.pattern) {
      input = (
        <RegExInput
          style={{ flexDirection: "row", flexWrap: "nowrap" }}
          mask={this.props.schema.pattern.slice(1, -1)}
          id={this.props.id}
          name={this.props.id}
          value={this.props.value || ""}
          onChange={this._onChange}
          warningMessage={
            this.props.options && this.props.options.warningMessage
          }
          onBlur={
            this.props.options &&
            this.props.options.autofill_from &&
            (!this.props.options.autofill_on ||
              this.props.options.autofill_on.indexOf("onBlur") > -1)
              ? this.autoFillOtherFields
              : null
          }
          onKeyDown={
            this.props.options &&
            this.props.options.autofill_from &&
            (!this.props.options.autofill_on ||
              this.props.options.autofill_on.indexOf("onEnter") > -1)
              ? this._onEnterAutofill
              : null
          }
          buttons={
            this.props.options &&
            this.props.options.autofill_from &&
            this.props.options.autofill_on &&
            this.props.options.autofill_on.indexOf("onClick") > -1
              ? enabled => this._renderAutofillButton(enabled)
              : null
          }
        />
      );
    } else {
      input = (
        <TextInput
          id={this.props.id}
          name={this.props.id}
          placeHolder={this.props.placeholder}
          onDOMChange={this._onChange}
          {...(this.props.autofocus
            ? {
                autoFocus: true
              }
            : {})}
          {...(this.props.options && this.props.options.autofill_from
            ? {
                onBlur: this.autoFillOtherFields,
                onKeyDown: this._onEnterAutofill
              }
            : {})}
          value={this.props.value || ""}
        />
      );
    }

    return [
      input,
      <Box key="indicators" align="end" pad={{ horizontal: "small" }}>
        <Box>
          {this.state.error && (
            <Box align="end">
              <span style={{ color: "#F04B37" }}>{this.state.error}</span>
            </Box>
          )}
          {this.state.autofillSuccess && (
            <Box align="end">
              <span style={{ color: "#509137" }}>
                Navigate to the next tab to review the fetched values.
              </span>
            </Box>
          )}
        </Box>
        <Box>{this.state.showSpinner ? <Spinning size="xsmall" /> : null}</Box>
      </Box>
    ];
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
  schema: PropTypes.object,
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
