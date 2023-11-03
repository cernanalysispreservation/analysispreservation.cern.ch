import { Cascader } from "antd";
import { transformSchema } from "../../partials/Utils/schema";
import { connect } from "react-redux";

const SchemaPathSuggester = ({
  disabled,
  onBlur,
  onChange,
  onFocus,
  readonly,
  required,
  name,
  formData,
  formContext,
  mosesState,
}) => {
  const { readonlyAsDisabled = true } = formContext;

  const handleChange = value => onChange(value && value.join("."));

  const getPropertiesOrItems = (obj, skip = true) => {
    if (obj.properties) return getPropertiesOrItems(obj.properties, false);
    if (obj.items) return getPropertiesOrItems(obj.items, false);
    if (skip) return;
    return obj;
  };

  const convertToOptions = obj => {
    if (obj === undefined) return;
    const ret = Object.entries(obj).map(([k, v]) => ({
      value: k,
      label: k,
      children: convertToOptions(getPropertiesOrItems(v)),
    }));
    return ret;
  };

  return (
    <Cascader
      options={convertToOptions(
        getPropertiesOrItems(
          transformSchema({ ...mosesState?.current?.schema })
        )
      )}
      disabled={disabled || (readonlyAsDisabled && readonly)}
      name={name}
      required={required}
      value={formData && formData.split(".")}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={handleChange}
    />
  );
};

function mapStateToProps(state) {
  return {
    mosesState: state.builder.get("mosesState"),
  };
}

export default connect(mapStateToProps)(SchemaPathSuggester);
