import React, { useEffect, useState } from "react";

import { DatePicker } from "antd";

import moment from "moment";

const DATE_ISO_FORMAT = "YYYY-MM-DD";
const DATE_TIME_ISO_FORMAT = "YYYY-MM-DD HH:mm:ss";
const DATE_DEFAULT_FORMAT = "DD/MM/YYYY";
const DATE_TIME_DEFAULT_FORMAT = "DD/MM/YYYY HH:mm:ss";

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
      setDefaultFormat(
        schema.format === "date-time"
          ? DATE_TIME_DEFAULT_FORMAT
          : DATE_DEFAULT_FORMAT
      );
    },
    [schema]
  );

  const handleChange = date => {
    onChange(
      date
        ? schema.format === "date-time"
          ? moment(date).toISOString(true)
          : moment(date).format(DATE_ISO_FORMAT)
        : undefined
    );
  };

  const handleBlur = ({ target }) => onBlur(id, target.checked);

  const handleFocus = ({ target }) => onFocus(id, target.checked);

  return (
    <DatePicker
      showTime={schema.format === "date-time"}
      format={schema.customFormat || defaultFormat}
      disabledDate={current =>
        current &&
        ((schema.minDate &&
          current < moment(schema.minDate, DATE_DEFAULT_FORMAT)) ||
          (schema.maxDate &&
            current > moment(schema.maxDate, DATE_DEFAULT_FORMAT).add(1, "d")))
      }
      autoFocus={autofocus}
      disabled={disabled || (readonlyAsDisabled && readonly)}
      id={id}
      name={id}
      onBlur={!readonly ? handleBlur : undefined}
      onChange={!readonly ? handleChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
      style={{ width: "100%" }}
      value={value && moment(value, DATE_TIME_ISO_FORMAT)}
    />
  );
};

export default DateWidget;
