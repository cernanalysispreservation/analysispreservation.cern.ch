import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Heading } from "grommet";
import { AiOutlineUp, AiOutlineDown } from "react-icons/ai";
import Form from "../../../../drafts/form/GrommetForm";
import fieldTypes from "../../utils/fieldTypes";

const PropertyKeyEditorForm = ({
  uiSchema = {},
  schema = {},
  formData = {},
  onChange = null,
  optionsSchemaObject,
  optionsUiSchemaObject,
  title = ""
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
    ...fieldTypes.simple.fields
  };

  return (
    <Box
      flex={true}
      colorIndex="light-2"
      style={{ borderRadius: "5px" }}
      margin={{ bottom: "small" }}
    >
      <Box
        flex={false}
        pad="small"
        separator="bottom"
        justify="between"
        direction="row"
        align="center"
        onClick={() => setDisplay(!display)}
      >
        <Heading tag="h3" margin="none">
          {title}
        </Heading>
        {display ? <AiOutlineUp size={18} /> : <AiOutlineDown size={18} />}
      </Box>
      {display && (
        <Box flex={true} pad="small">
          <Form
            schema={objs[type][`${optionsSchemaObject}`]}
            uiSchema={objs[type][`${optionsUiSchemaObject}`]}
            formData={formData}
            onChange={onChange}
          />
        </Box>
      )}
    </Box>
  );
};

PropertyKeyEditorForm.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
  onChange: PropTypes.func,
  optionsSchemaObject: PropTypes.object,
  optionsUiSchemaObject: PropTypes.object,
  title: PropTypes.string
};

export default PropertyKeyEditorForm;
