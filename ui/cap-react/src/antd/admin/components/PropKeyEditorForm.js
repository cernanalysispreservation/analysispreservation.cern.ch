import React, { useState } from "react";
import PropTypes from "prop-types";
import Form from "../../forms/Form";
import fieldTypes from "../utils/fieldTypes";
import { Button, Card, Row } from "antd";
import { UpOutlined } from "@ant-design/icons";

import widgets from "../formComponents/widgets";

const PropertyKeyEditorForm = ({
  uiSchema = {},
  schema = {},
  formData = {},
  onChange = null,
  optionsSchemaObject,
  optionsUiSchemaObject,
  title = "",
}) => {
  const [display, setDisplay] = useState(true);

  let type;

  // in case we can not define the type of the element from the uiSchema,
  // extract the type from the schema
  if (
    !uiSchema ||
    (!uiSchema["ui:widget"] && !uiSchema["ui:field"] && !uiSchema["ui:object"])
  ) {
    type = schema.type === "string" ? "text" : schema.type;
  } else {
    if (uiSchema["ui:widget"]) {
      type = uiSchema["ui:widget"];
    }
    if (uiSchema["ui:field"]) {
      type = uiSchema["ui:field"];
      if (
        uiSchema["ui:field"] === "idFetcher" &&
        uiSchema["ui:servicesList"].length < 3
      ) {
        type = uiSchema["ui:servicesList"][0].value;
      }
    }
    if (uiSchema["ui:object"]) {
      type = uiSchema["ui:object"];
    }
  }

  // if there is no type then there is nothing to return
  if (!type) return;
  const objs = {
    ...fieldTypes.advanced.fields,
    ...fieldTypes.simple.fields,
  };

  return (
    <Card
      title={title}
      extra={display && <UpOutlined onClick={() => setDisplay(false)} />}
    >
      {display ? (
        <Form
          schema={objs[type][`${optionsSchemaObject}`] || {}}
          uiSchema={objs[type][`${optionsUiSchemaObject}`] || {}}
          widgets={widgets}
          formData={formData}
          onChange={onChange}
        />
      ) : (
        <Row justify="center">
          <Button onClick={() => setDisplay(true)}>Show more</Button>
        </Row>
      )}
    </Card>
  );
};

PropertyKeyEditorForm.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
  onChange: PropTypes.func,
  optionsSchemaObject: PropTypes.object,
  optionsUiSchemaObject: PropTypes.object,
  title: PropTypes.string,
};

export default PropertyKeyEditorForm;
