import { getDefaultRegistry } from "@rjsf/core";
import {
  getUiOptions,
  getWidget,
  isFilesArray,
  isFixedItems,
  isMultiSelect,
  optionsList,
  retrieveSchema,
} from "@rjsf/utils";
import PropTypes from "prop-types";
import FixedArrayFieldTemplate from "./FixedArrayFieldTemplate";
import NormalArrayFieldTemplate from "./NormalArrayFieldTemplate";

const ArrayFieldTemplate = ({
  autofocus,
  canAdd,
  className,
  disabled,
  formContext,
  formData,
  idSchema,
  items,
  label,
  name,
  onAddClick,
  onBlur,
  onChange,
  onFocus,
  placeholder,
  rawErrors,
  readonly,
  registry = getDefaultRegistry(),
  required,
  schema,
  title,
  uiSchema,
}) => {
  const { fields, rootSchema, widgets } = registry;
  const { UnsupportedField } = fields;

  const renderFiles = () => {
    const { widget = "files", ...options } = getUiOptions(uiSchema);

    const Widget = getWidget(schema, widget, widgets);

    return (
      <Widget
        autofocus={autofocus}
        disabled={disabled}
        formContext={formContext}
        id={idSchema && idSchema.$id}
        multiple
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        options={options}
        rawErrors={rawErrors}
        readonly={readonly}
        schema={schema}
        title={schema.title || name} // Why not props.title?
        value={formData}
      />
    );
  };

  const renderMultiSelect = () => {
    const itemsSchema = retrieveSchema(schema.items, rootSchema, formData);
    const enumOptions = optionsList(itemsSchema);
    const { widget = "select", ...options } = {
      ...getUiOptions(uiSchema),
      enumOptions,
    };

    const Widget = getWidget(schema, widget, widgets);

    return (
      <Widget
        autofocus={autofocus}
        disabled={disabled}
        formContext={formContext}
        id={idSchema && idSchema.$id}
        label={label}
        multiple
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        options={options}
        placeholder={placeholder}
        rawErrors={rawErrors}
        readonly={readonly}
        registry={registry}
        required={required}
        schema={schema}
        value={formData}
      />
    );
  };

  if (!Object.prototype.hasOwnProperty.call(schema, "items")) {
    return (
      <UnsupportedField
        idSchema={idSchema}
        reason="Missing items definition"
        schema={schema}
      />
    );
  }

  if (isFixedItems(schema)) {
    const { ...options } = getUiOptions(uiSchema);
    return (
      <FixedArrayFieldTemplate
        canAdd={canAdd}
        className={className}
        disabled={disabled}
        formContext={formContext}
        formData={formData}
        idSchema={idSchema}
        items={items}
        onAddClick={onAddClick}
        options={options}
        readonly={readonly}
        registry={registry}
        required={required}
        schema={schema}
        title={title}
        uiSchema={uiSchema}
      />
    );
  }
  if (isFilesArray(schema, uiSchema, rootSchema)) {
    return renderFiles();
  }
  if (isMultiSelect(schema, rootSchema)) {
    return renderMultiSelect();
  }

  const { ...options } = getUiOptions(uiSchema);

  return (
    <NormalArrayFieldTemplate
      canAdd={canAdd}
      className={className}
      disabled={disabled}
      formContext={formContext}
      formData={formData}
      idSchema={idSchema}
      items={items}
      options={options}
      onAddClick={onAddClick}
      readonly={readonly}
      registry={registry}
      required={required}
      schema={schema}
      title={title}
      uiSchema={uiSchema}
    />
  );
};
ArrayFieldTemplate.propTypes = {
  autofocus: PropTypes.bool,
  canAdd: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  formContext: PropTypes.object,
  formData: PropTypes.object,
  idSchema: PropTypes.object,
  items: PropTypes.array,
  label: PropTypes.string,
  name: PropTypes.string,
  onAddClick: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  rawErrors: PropTypes.object,
  readonly: PropTypes.bool,
  registry: PropTypes.object,
  required: PropTypes.bool,
  schema: PropTypes.object,
  title: PropTypes.string,
  uiSchema: PropTypes.object,
};
export default ArrayFieldTemplate;
