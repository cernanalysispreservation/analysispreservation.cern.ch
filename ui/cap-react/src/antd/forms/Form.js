import React from "react";
import PropTypes from "prop-types";
import ObjectFieldTemplate from "./templates/ObjectFieldTemplate";
import FieldTemplate from "./templates/Field/FieldTemplate";
import fields from "./fields";
import widgets from "./widgets";
import _debounce from "lodash/debounce";

import "./Form.less";
import Form from "@rjsf/antd";
import objectPath from "object-path";
import ArrayFieldTemplate from "./templates/ArrayFieldTemplates";

const RJSFForm = ({
  formRef,
  schema,
  uiSchema,
  formData,
  extraErrors,
  onChange,
  formContext,
  readonly,
  draftEditor,
  className = []
}) => {
  // mainly this is used for the drafts forms
  // we want to allow forms to be saved even without required fields
  // if these fields are not filled in when publishing then an error will be shown
  const transformErrors = errors => {
    errors = errors.filter(item => item.name != "required");
    errors.map(error => {
      if (error.name == "required") return null;

      // Update messages for undefined fields when required,
      // from "should be string" ==> "Either edit or remove"
      if (error.message == "should be string") {
        let errorMessages = objectPath.get(formData, error.property);
        if (errorMessages == undefined) error.message = "Either edit or remove";
      }

      return error;
    });

    return errors;
  };

  const NESTED_CASES = ["object", "array"];
  // checks for the user permissions
  // if the user is in the list then we are setting readOnly field to true
  const checkIfUserHasPermissions = (obj, user) => {
    const users = obj["x-cap-permissions"]["users"];
    if (users) {
      return users.includes(user);
    }
    return false;
  };
  const checkSchemaForPermissions = schema => {
    let nextSteps = NESTED_CASES.includes(schema.type)
      ? schema.type == "object"
        ? "properties"
        : "items"
      : null;

    // check if this block has this field for permission checks
    schema["x-cap-permissions"] &&
    checkIfUserHasPermissions(schema, "info@inveniosoftware.org")
      ? (schema["readOnly"] = "true")
      : null;

    // if the current block is either an object or an array
    // then we should examine the nested fields
    if (nextSteps) {
      if (schema[nextSteps] && schema[nextSteps]["type"]) {
        let next = NESTED_CASES.includes(schema[nextSteps].type)
          ? schema[nextSteps].type == "object"
            ? "properties"
            : "items"
          : null;

        if (next) checkSchemaForPermissions(schema[nextSteps]);
        else {
          schema[nextSteps]["x-cap-permissions"] &&
          checkIfUserHasPermissions(
            schema[nextSteps],
            "info@inveniosoftware.org"
          )
            ? (schema[nextSteps]["readOnly"] = "true")
            : null;
        }
      } else {
        // in case that we enter in a block that does not have any of the type
        // then we shoyld start iterating for nested cases
        schema[nextSteps] &&
          Object.values(schema[nextSteps]).map(val => {
            schema["x-cap-permissions"] &&
            checkIfUserHasPermissions(schema, "info@inveniosoftware.org")
              ? (schema["readOnly"] = "true")
              : null;

            checkSchemaForPermissions(val);
          });
      }
    }
  };

  // call to update the schema fields
  checkSchemaForPermissions(schema);

  return (
    <Form
      className={["__Form__", ...className].join(" ")}
      ref={formRef}
      schema={schema}
      uiSchema={uiSchema}
      fields={fields}
      formData={formData}
      widgets={widgets}
      ObjectFieldTemplate={ObjectFieldTemplate}
      ArrayFieldTemplate={ArrayFieldTemplate}
      FieldTemplate={FieldTemplate}
      liveValidate={false}
      noValidate={false}
      showErrorList={false}
      noHtml5Validate={true}
      onError={() => {}}
      onBlur={() => {}}
      extraErrors={extraErrors}
      onChange={_debounce(onChange, 500)}
      readonly={readonly}
      transformErrors={draftEditor && transformErrors}
      formContext={{
        formRef: formRef,
        ...formContext
      }}
    >
      <span />
    </Form>
  );
};

RJSFForm.propTypes = {
  formRef: PropTypes.object,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
  extraErrors: PropTypes.object,
  onChange: PropTypes.func,
  formContext: PropTypes.object,
  mode: PropTypes.string,
  draftEditor: PropTypes.bool,
  readonly: PropTypes.bool,
  className: PropTypes.array
};

export default RJSFForm;
