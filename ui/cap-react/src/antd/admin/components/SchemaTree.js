import React from "react";
import PropTypes from "prop-types";
import Form from "../../forms/Form";
import { transformSchema } from "../../partials/Utils/schema";
import ObjectFieldTemplate from "../formComponents/ObjectFieldTemplate";
import ArrayFieldTemplate from "../formComponents/ArrayFieldTemplate";
import FieldTemplate from "../formComponents/FieldTemplate";
import TextWidget from "../formComponents/TextWidget";
import { _validate } from "../utils";

const SchemaTree = ({ schema, uiSchema }) => {
  const widgets = {
    text: TextWidget,
    textarea: TextWidget,
    select: TextWidget
  };

  return (
    <Form
      schema={transformSchema(schema.toJS())}
      uiSchema={uiSchema.toJS()}
      formData={{}}
      widgets={widgets}
      ObjectFieldTemplate={ObjectFieldTemplate}
      ArrayFieldTemplate={ArrayFieldTemplate}
      FieldTemplate={FieldTemplate}
      onChange={() => {}}
      validate={_validate}
      noHtml5Validate={true}
      liveValidate={true}
      formContext={{ schema: [], uiSchema: [] }}
    />
  );
};

SchemaTree.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object
};

export default SchemaTree;
