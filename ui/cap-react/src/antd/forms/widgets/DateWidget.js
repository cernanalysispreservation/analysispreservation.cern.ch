import React, { useEffect, useState } from "react";

import { DatePicker } from "antd";

import dayjs from "dayjs";

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

  const [isoFormat, setIsoFormat] = useState();

  useEffect(
    () => {
      setIsoFormat(
        schema.format === "date-time" ? DATE_TIME_ISO_FORMAT : DATE_ISO_FORMAT
      );
    },
    [schema]
  );

  const handleChange = date =>
    onChange(date ? date.format(isoFormat) : undefined);

  const handleBlur = ({ target }) => onBlur(id, target.checked);

  const handleFocus = ({ target }) => onFocus(id, target.checked);

  return (
    <DatePicker
      showTime={schema.format === "date-time"}
      format={
        schema.customFormat ||
        (schema.format === "date-time"
          ? DATE_TIME_DEFAULT_FORMAT
          : DATE_DEFAULT_FORMAT)
      }
      disabledDate={current =>
        current &&
        ((schema.minDate && current < dayjs(schema.minDate, DATE_ISO_FORMAT)) ||
          (schema.maxDate &&
            current > dayjs(schema.maxDate, DATE_ISO_FORMAT).add(1, "d")))
      }
      autoFocus={autofocus}
      disabled={disabled || (readonlyAsDisabled && readonly)}
      id={id}
      name={id}
      onBlur={!readonly ? handleBlur : undefined}
      onChange={!readonly ? handleChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
      style={{ width: "100%" }}
      value={value && dayjs(value, isoFormat)}
    />
  );
};

export default DateWidget;
