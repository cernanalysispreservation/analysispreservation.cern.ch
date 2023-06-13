import { useState } from "react";
import MaskedInput from "./MaskedInput";
import { Button, InputNumber } from "antd";
import axios from "axios";
import { fromJS } from "immutable";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { formDataChange } from "../../../actions/draftItem";

const INPUT_STYLE = {
  width: "100%",
};

const TextWidget = ({
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
  formData,
}) => {
  const { readonlyAsDisabled = true } = formContext;

  const { autofill_from, autofill_on, convertToUppercase, mask } = options;

  const handleNumberChange = nextValue => onChange(nextValue);

  const handleTextChange = ({ target }) => {
    apiCalledWithCurrentState && setApiCalledWithCurrentState(false);
    message && setMessage(null);
    onChange(
      target.value === ""
        ? options.emptyValue
        : convertToUppercase
        ? target.value.toUpperCase()
        : target.value
    );
  };

  const handleBlur = ({ target }) => onBlur(id, target.value);

  const handleFocus = ({ target }) => onFocus(id, target.value);

  const [message, setMessage] = useState(null);

  const [apiCalling, setApiCalling] = useState(false);
  const [apiCalledWithCurrentState, setApiCalledWithCurrentState] =
    useState(false);

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
      // replace # with current path
      let destination = _replace_hash_with_current_indexes(el[1]);
      newFormData = newFormData.setIn(destination, undefined);
    });
    formDataChange(newFormData.toJS());

    setApiCalling(true);
    setApiCalledWithCurrentState(true);
    setMessage(null);
    axios
      .get(`${url}${event.target.value}`)
      .then(({ data }) => {
        if (Object.keys(data).length !== 0) {
          let _data = fromJS(data);

          fieldsMap.map(el => {
            // replace # with current path
            let destination = _replace_hash_with_current_indexes(el[1]);
            newFormData = newFormData.setIn(destination, _data.getIn(el[0]));
          });

          formDataChange(newFormData.toJS());
          setApiCalling(false);
          setMessage({
            status: "success",
            message: "Navigate to the next tab to review the fetched values.",
          });
        } else {
          setApiCalling(false);
          setMessage({
            status: "error",
            message: "Results not found",
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
              : "Something went wrong with the request ",
        });
      });
  };

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
          ? autofill_from &&
            (!autofill_on || (autofill_on && autofill_on.includes("onBlur")))
            ? autoFillOtherFields
            : handleBlur
          : undefined
      }
      onChange={!readonly ? handleTextChange : undefined}
      onPressEnter={
        !readonly
          ? (!autofill_on ||
              (autofill_on && autofill_on.includes("onEnter"))) &&
            autoFillOtherFields
          : undefined
      }
      onFocus={!readonly ? handleFocus : undefined}
      placeholder={placeholder}
      value={value}
      pattern={schema.pattern}
      mask={mask}
      convertToUppercase={convertToUppercase}
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
  formData: state.draftItem.get("formData"),
});

const mapDispatchToProps = dispatch => ({
  formDataChange: data => dispatch(formDataChange(data)),
});

TextWidget.propTypes = {
  disabled: PropTypes.bool,
  formContext: PropTypes.object,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool,
  schema: PropTypes.object,
  formData: PropTypes.object,
  value: PropTypes.string,
  options: PropTypes.object,
  onBlur: PropTypes.func,
  formDataChange: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(TextWidget);
