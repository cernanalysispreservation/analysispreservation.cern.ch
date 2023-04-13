import { Checkbox } from "antd";

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
  value,
  options,
  schema,
}) => {
  const { readonlyAsDisabled = true } = formContext;

  const handleChange = event => {
    if (schema.type === "boolean") {
      if (event.target.checked) {
        onChange(schema.checkedValue || true);
      } else {
        onChange(schema.uncheckedValue || false);
      }
    } else {
      onChange(event);
    }
  };

  const handleBlur = ({ target }) => onBlur(id, target.checked);

  const handleFocus = ({ target }) => onFocus(id, target.checked);

  if (schema.type === "boolean") {
    return (
      <Checkbox
        autoFocus={autofocus}
        checked={
          schema.checkedValue
            ? schema.checkedValue === value
              ? true
              : false
            : value
        }
        disabled={disabled || (readonlyAsDisabled && readonly)}
        id={id}
        name={id}
        onBlur={!readonly ? handleBlur : undefined}
        onChange={!readonly ? handleChange : undefined}
        onFocus={!readonly ? handleFocus : undefined}
      >
        {label}
      </Checkbox>
    );
  } else {
    return (
      <Checkbox.Group
        options={options.enumOptions.map(
          option => (!option.value ? { ...option, value: "null" } : option)
        )}
        autoFocus={autofocus}
        value={value || []}
        disabled={disabled || (readonlyAsDisabled && readonly)}
        onBlur={!readonly ? handleBlur : undefined}
        onChange={!readonly ? handleChange : undefined}
        onFocus={!readonly ? handleFocus : undefined}
      />
    );
  }
};

export default CheckboxWidget;
