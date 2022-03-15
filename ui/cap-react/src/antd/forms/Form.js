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
import CmsWidgets from "../admin/formComponents/widgets";

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
  ObjectFieldTemplate: Objects,
  ArrayFieldTemplate: Arrays,
  FieldTemplate: Fields,
  widgets: Widgets,
  validate,
  liveValidate = false,
  showErrorList = false
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

  return (
    <Form
      className={["__Form__", ...className].join(" ")}
      ref={formRef}
      schema={schema}
      uiSchema={uiSchema}
      tagName="div"
      fields={fields}
      formData={formData}
      widgets={{ ...widgets, ...Widgets, ...CmsWidgets }}
      ObjectFieldTemplate={Objects || ObjectFieldTemplate}
      ArrayFieldTemplate={Arrays || ArrayFieldTemplate}
      FieldTemplate={Fields || FieldTemplate}
      liveValidate={liveValidate}
      noValidate={false}
      showErrorList={showErrorList}
      noHtml5Validate={true}
      onError={() => {}}
      onBlur={() => {}}
      validate={validate}
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
  validate: PropTypes.func,
  formContext: PropTypes.object,
  widgets: PropTypes.object,
  mode: PropTypes.string,
  draftEditor: PropTypes.bool,
  readonly: PropTypes.bool,
  className: PropTypes.array,
  liveValidate: PropTypes.bool,
  showErrorList: PropTypes.bool,
  FieldTemplate: PropTypes.node,
  ObjectFieldTemplate: PropTypes.node,
  ArrayFieldTemplate: PropTypes.node
};

export default RJSFForm;
