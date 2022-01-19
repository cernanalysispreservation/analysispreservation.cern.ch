import React from "react";
import PropTypes from "prop-types";
import ObjectFieldTemplate from "./templates/ObjectFieldTemplate";
import FieldTemplate from "./templates/Field/FieldTemplate";
import widgets from "./widgets";
import _debounce from "lodash/debounce";

import "./Form.less";
import Form from "@rjsf/antd";

const RJSFForm = ({
  formRef,
  schema,
  uiSchema,
  formData,
  extraErrors,
  onChange,
  formContext,
  mode
}) => {
  return (
    <Form
      className="__Form__"
      ref={formRef}
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      widgets={widgets}
      ObjectFieldTemplate={ObjectFieldTemplate}
      FieldTemplate={FieldTemplate}
      showErrorList={false}
      extraErrors={extraErrors}
      onChange={_debounce(onChange, 500)}
      readonly={mode != "edit"}
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
  mode: PropTypes.string
};

export default RJSFForm;
