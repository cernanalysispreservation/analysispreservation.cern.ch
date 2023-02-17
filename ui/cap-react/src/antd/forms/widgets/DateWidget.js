import React, { useEffect, useState } from "react";

import { DatePicker } from "antd";

import moment from "moment";

const DATE_FORMAT = "DD/MM/YYYY";
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm:ss";

const DateWidget = ({
  autofocus,
  disabled,
  formContext,
  id,
  onBlur,
  onChange,
  onFocus,
  readonly,
  value,
  schema,
}) => {
  const { readonlyAsDisabled = true } = formContext;

  const [defaultFormat, setDefaultFormat] = useState();

  useEffect(
    () => {
      setDefaultFormat(schema.allowTime ? DATE_TIME_FORMAT : DATE_FORMAT);
    },
    [schema]
  );

  const handleChange = (_, dateString) => {
    onChange(dateString);
  };

  const handleBlur = ({ target }) => onBlur(id, target.checked);

  const handleFocus = ({ target }) => onFocus(id, target.checked);

  return (
    <DatePicker
      showTime={schema.allowTime}
      format={schema.format || defaultFormat}
      disabledDate={current =>
        current &&
        ((schema.minDate && current < moment(schema.minDate, DATE_FORMAT)) ||
          (schema.maxDate &&
            current > moment(schema.maxDate, DATE_FORMAT).add(1, "d")))
      }
      autoFocus={autofocus}
      checked={schema.type === "string" ? value === "true" : value}
      disabled={disabled || (readonlyAsDisabled && readonly)}
      id={id}
      name={id}
      onBlur={!readonly ? handleBlur : undefined}
      onChange={!readonly ? handleChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
      style={{ width: "100%" }}
      value={value && moment(value, schema.format || defaultFormat)}
    />
  );
};

export default DateWidget;
