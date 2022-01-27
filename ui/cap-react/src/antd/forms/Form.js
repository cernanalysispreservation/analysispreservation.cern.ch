import React from "react";
import PropTypes from "prop-types";
import ObjectFieldTemplate from "./templates/ObjectFieldTemplate";
import FieldTemplate from "./templates/Field/FieldTemplate";
import TitleField from "./fields/TitleField";
import widgets from "./widgets";
import _debounce from "lodash/debounce";

import "./Form.less";
import Form from "@rjsf/antd";
import objectPath from "object-path";
import ArrayFieldTemplateItem from "./templates/ArrayFieldTemplates";

const RJSFForm = ({
  formRef,
  schema,
  uiSchema,
  formData,
  extraErrors,
  onChange,
  formContext,
  mode,
  draftEditor
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
      className="__Form__"
      ref={formRef}
      schema={schema}
      uiSchema={uiSchema}
      fields={{ TitleField }}
      formData={formData}
      widgets={widgets}
      ObjectFieldTemplate={ObjectFieldTemplate}
      ArrayFieldTemplate={ArrayFieldTemplateItem}
      FieldTemplate={FieldTemplate}
      showErrorList={false}
      extraErrors={extraErrors}
      onChange={_debounce(onChange, 500)}
      readonly={mode != "edit"}
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
  draftEditor: PropTypes.bool
};

export default RJSFForm;
