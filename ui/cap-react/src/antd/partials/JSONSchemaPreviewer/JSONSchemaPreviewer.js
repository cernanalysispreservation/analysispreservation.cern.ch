import React from "react";
import PropTypes from "prop-types";
import Form from "react-jsonschema-form";

import FieldTemplate from "../../../components/drafts/form/themes/grommet-preview/templates/FieldTemplate";
import ArrayFieldTemplate from "../../../components/drafts/form/themes/grommet/templates/ArrayFieldTemplate";
import ObjectFieldTemplate from "../../../components/drafts/form/themes/grommet/templates/ObjectFieldTemplate";

import widgets from "../../../components/drafts/form/themes/grommet-preview/widgets";
import fields from "../../../components/drafts/form/themes/grommet-preview/fields";

const JSONSchemaPreviewer = ({
  isPublished,
  schema,
  uiSchema,
  children,
  display = "tabView",
  onChange,
  onSubmit,
  formData
}) => {
  return (
    schema && (
      <Form
        schema={schema}
        FieldTemplate={FieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        ArrayFieldTemplate={ArrayFieldTemplate}
        showErrorList={false}
        widgets={widgets}
        fields={fields}
        uiSchema={{
          "ui:readonly": true,
          ...uiSchema,
          "ui:object": display
        }}
        liveValidate={false}
        noValidate={true}
        onError={() => {}}
        formData={formData}
        onBlur={() => {}}
        onChange={onChange}
        onSubmit={onSubmit}
        formContext={{
          tabView: display === "tabView",
          readonlyPreview: true,
          isPublished: isPublished
        }}
      >
        {children}
      </Form>
    )
  );
};

JSONSchemaPreviewer.propTypes = {
  display: PropTypes.string,
  children: PropTypes.node,
  isPublished: PropTypes.bool,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func
};

export default JSONSchemaPreviewer;
