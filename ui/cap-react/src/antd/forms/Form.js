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
  className = [],
  currentUser,
}) => {
  let userEmail = currentUser
    ? currentUser.getIn(["profile", "email"])
    : "noUserEmail";
  // mainly this is used for the drafts forms
  // we want to allow forms to be saved even without required fields
  // if these fields are not filled in when publishing then an error will be shown
  const transformErrors = (errors) => {
    errors = errors.filter((item) => item.name != "required");
    errors.map((error) => {
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
  // if the user is in the list then we can allow edit the field
  // if not in the list then we should make the field readOnly

  const canUserEditField = (obj, user) => {
    // get the list with the users
    const users = obj["x-cap-permission"]["users"];

    // if the user is in the list, it means he can edit
    if (users) {
      return users.map(i => i.toLowerCase()).includes(usertoLowerCase());
    }
    return false;
  };
  const checkSchemaForPermissions = (schema) => {
    let nextSteps = NESTED_CASES.includes(schema.type)
      ? schema.type == "object"
        ? "properties"
        : "items"
      : null;

    // check if this block has this field for permission checks
    schema["x-cap-permission"] &&
      !canUserEditField(schema, userEmail) &&
      (schema["readOnly"] = "true");

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
          schema[nextSteps]["x-cap-permission"] &&
            !canUserEditField(schema[nextSteps], userEmail) &&
            (schema[nextSteps]["readOnly"] = "true");
        }
      } else {
        // in case that we enter in a block that does not have any of the type
        // then we shoyld start iterating for nested cases
        schema[nextSteps] &&
          Object.values(schema[nextSteps]).map((val) => {
            schema["x-cap-permission"] &&
              !canUserEditField(schema, userEmail) &&
              (schema["readOnly"] = "true");

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
        ...formContext,
      }}
    >
      <span />
    </Form>
  );
};

RJSFForm.propTypes = {
  formRef: PropTypes.object,
  currentUser: PropTypes.object,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
  extraErrors: PropTypes.object,
  onChange: PropTypes.func,
  formContext: PropTypes.object,
  mode: PropTypes.string,
  draftEditor: PropTypes.bool,
  readonly: PropTypes.bool,
  className: PropTypes.array,
};

export default RJSFForm;
