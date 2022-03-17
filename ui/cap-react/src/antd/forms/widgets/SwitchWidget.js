import React from "react";

import { Switch } from "antd";

const CheckboxWidget = ({
  autofocus,
  disabled,
  formContext,
  id,
  label,
  onBlur,
  onChange,
  onFocus,
  readonly,
  value
}) => {
  const { readonlyAsDisabled = true } = formContext;

  const handleChange = checked => onChange(checked);

  const handleBlur = ({ target }) => onBlur(id, target.checked);

  const handleFocus = ({ target }) => onFocus(id, target.checked);

  return (
    <Switch
      autoFocus={autofocus}
      checked={typeof value === "undefined" ? false : value}
      disabled={disabled || (readonlyAsDisabled && readonly)}
      id={id}
      name={id}
      onBlur={!readonly ? handleBlur : undefined}
      onChange={!readonly ? handleChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
    >
      {label}
    </Switch>
  );
};

export default CheckboxWidget;
