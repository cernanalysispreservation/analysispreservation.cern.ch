import React from "react";
import PropTypes from "prop-types";
import Form from "../../forms/Form";
import { transformSchema } from "../../partials/Utils/schema";

const FormPreview = ({ schema, uiSchema }) => {
  return (
    <Form
      schema={transformSchema(schema.toJS())}
      uiSchema={uiSchema.toJS()}
      formData={{}}
      onChange={() => {}}
    />
  );
};

FormPreview.propTypes = {};

export default FormPreview;
