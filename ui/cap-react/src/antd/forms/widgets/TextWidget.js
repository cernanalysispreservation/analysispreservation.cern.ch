import React, { useState } from "react";
import MaskedInput from "./MaskedInput";
import { Button, InputNumber } from "antd";
import axios from "axios";
import { fromJS } from "immutable";
import { connect } from "react-redux";
import { formDataChange } from "../../../actions/draftItem";
const INPUT_STYLE = {
  width: "100%"
};

const TextWidget = ({
  // autofocus,
  disabled,
  formContext,
  id,
  onBlur,
  onChange,
  onFocus,
  options,
  placeholder,
  readonly,
  schema,
  value,
  formDataChange,
  formData
}) => {
  const { readonlyAsDisabled = true } = formContext;

  const handleNumberChange = nextValue => onChange(nextValue);

  const handleTextChange = ({ target }) =>
    onChange(target.value === "" ? options.emptyValue : target.value);

  const handleBlur = ({ target }) => onBlur(id, target.value);

  const handleFocus = ({ target }) => onFocus(id, target.value);

  const [apiCalledWithCurrentState, setApiCalledWithCurrentState] = useState(
    false
  );

  const [message, setMessage] = useState(null);

  const [apiCalling, setApiCalling] = useState(false);

  const _replace_hash_with_current_indexes = path => {
    let indexes = id.split("_").filter(item => !isNaN(item)),
      index_cnt = 0;

    return path.map(item => {
      item = item === "#" ? indexes[index_cnt] : item;
      if (!isNaN(item)) ++index_cnt;
      return item;
    });
  };
  const autoFillOtherFields = event => {
    let url = options.autofill_from,
      fieldsMap = options.autofill_fields,
      newFormData = fromJS(formData);
    if (
      !event.target.value ||
      (value === event.target.value && apiCalledWithCurrentState)
    )
      return;

    fieldsMap.map(el => {
      let destination = el[1];

      // replace # with current path
      destination = _replace_hash_with_current_indexes(destination);
      newFormData = newFormData.setIn(destination, undefined);
    });
    formDataChange(newFormData.toJS());

    setApiCalledWithCurrentState(true);
    setApiCalling(true);
    setMessage;
    axios
      .get(`${url}${event.target.value}`)
      .then(({ data }) => {
        if (Object.keys(data).length !== 0) {
          let _data = fromJS(data);

          fieldsMap.map(el => {
            let source = el[0],
              destination = el[1];

            // replace # with current path
            destination = _replace_hash_with_current_indexes(destination);
            newFormData = newFormData.setIn(destination, _data.getIn(source));
          });

          formDataChange(newFormData.toJS());
          setApiCalling(false);
          setMessage({
            status: "success",
            message: "Navigate to the next tab to review the fetched values."
          });
        } else {
          setApiCalling(false);
          setMessage({
            status: "error",
            message: "Something went wrong with the request"
          });
        }
      })
      .catch(err => {
        setApiCalling(false);
        setMessage({
          status: "error",
          message:
            err.response.status !== 500
              ? err.response.data && err.response.data.message
                ? err.response.data.message
                : "Your request was not successful, please try again "
              : "Something went wrong with the request "
        });
      });
  };

  const _onEnterAutofill = event => {
    if (event.keyCode === 13) {
      setMessage(null);
      autoFillOtherFields(event);
    }
  };

  const {
    autofill_from,
    autofill_on,
    masked_array = [
      {
        regexp: "^.*$"
      }
    ]
  } = options;

  return schema.type === "number" || schema.type === "integer" ? (
    <InputNumber
      disabled={disabled || (readonlyAsDisabled && readonly)}
      id={id}
      name={id}
      onBlur={!readonly ? handleBlur : undefined}
      onChange={!readonly ? handleNumberChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
      placeholder={placeholder}
      style={INPUT_STYLE}
      type="number"
      value={value}
    />
  ) : (
    <MaskedInput
      disabled={disabled || (readonlyAsDisabled && readonly)}
      id={id}
      name={id}
      onBlur={
        !readonly
          ? autofill_from
            ? autoFillOtherFields
            : handleBlur
          : undefined
      }
      onChange={!readonly ? handleTextChange : undefined}
      onKeyDown={
        !readonly
          ? (!autofill_on ||
              (autofill_on && autofill_on.includes("onEnter"))) &&
            _onEnterAutofill
          : undefined
      }
      onFocus={!readonly ? handleFocus : undefined}
      placeholder={placeholder}
      style={INPUT_STYLE}
      type={options.inputType || "text"}
      value={value}
      schemaMask={schema.pattern}
      mask={masked_array}
      message={message}
      buttons={
        autofill_from &&
        autofill_on &&
        autofill_on.includes("onClick") &&
        (enabled => (
          <Button
            type="primary"
            disabled={!enabled || readonly}
            loading={apiCalling}
            onClick={() => autoFillOtherFields({ target: { value: value } })}
          >
            AutoFill
          </Button>
        ))
      }
    />
  );
};

const mapStateToProps = state => ({
  formData: state.draftItem.get("formData")
});

const mapDispatchToProps = dispatch => ({
  formDataChange: data => dispatch(formDataChange(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextWidget);
