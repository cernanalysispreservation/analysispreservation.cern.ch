import { Switch } from "antd";

const SwitchWidget = ({
  autofocus,
  disabled,
  formContext,
  id,
  label,
  onBlur,
  onChange,
  onFocus,
  readonly,
  value,
  schema,
}) => {
  const { readonlyAsDisabled = true } = formContext;

  const handleChange = checked => {
    if (schema.type === "string") {
      onChange(String(checked));
    } else if (schema.type === "number") {
      onChange(checked ? 1 : 0);
    } else {
      onChange(checked);
    }
  };

  const handleBlur = ({ target }) => onBlur(id, target.checked);

  const handleFocus = ({ target }) => onFocus(id, target.checked);

  return (
    <Switch
      autoFocus={autofocus}
      checked={schema.type === "string" ? value === "true" : value}
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

export default SwitchWidget;
