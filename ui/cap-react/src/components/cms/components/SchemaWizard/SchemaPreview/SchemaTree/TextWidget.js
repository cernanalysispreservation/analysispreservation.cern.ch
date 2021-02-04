import React from "react";
import PropTypes from "prop-types";
import SchemaTreeItem from "./SchemaTreeItem";

const TextWidget = props => {
  const { formContext, rawErrors = [] } = props;

  // let path = {
  //   schema: [...formContext.schema, ...(rawErrors[0].schema || [])],
  //   uiSchema: [...formContext.uiSchema, ...(rawErrors[0].uiSchema || [])]
  // };
  let path = {
    schema: [
      ...formContext.schema,
      ...(rawErrors.length > 0
        ? rawErrors.length > 1
          ? rawErrors[2].schema
          : rawErrors[0].schema
        : [])
    ],
    uiSchema: [
      ...formContext.schema,
      ...(rawErrors.length > 0
        ? rawErrors.length > 1
          ? rawErrors[2].uiSchema
          : rawErrors[0].uiSchema
        : [])
    ]
  };

  return <SchemaTreeItem type="array" {...props} path={path} />;
};

TextWidget.propTypes = {
  formContext: PropTypes.object,
  rawErrors: PropTypes.array
};

export default TextWidget;
