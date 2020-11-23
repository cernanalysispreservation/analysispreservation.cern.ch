import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import SchemaTreeItem from "./SchemaTreeItem";
import HoverBox from "./HoverBox";
import Form from "react-jsonschema-form";
import TextWidget from "./TextWidget";
import { connect } from "react-redux";
import { addByPath } from "../../../../../../actions/schemaWizard";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import FieldTemplate from "./FieldTemplate";
import { _validate } from "./utils/validate";
import ViewIcon from "grommet/components/icons/base/View";

const widgets = {
  TextWidget: TextWidget
};

const ArrayFieldTemplate = props => {
  const [display, setDisplay] = useState(false);
  let { schema: schemaPath, uiSchema: uiSchemaPath } = props.rawErrors[0];
  let _path = {
    schema: [...props.formContext.schema, ...schemaPath, "items"],
    uiSchema: [...props.formContext.uiSchema, ...uiSchemaPath, "items"]
  };

  let __path = {
    schema: [...props.formContext.schema, ...schemaPath, "items"],
    uiSchema: [...props.formContext.uiSchema, ...uiSchemaPath]
  };

  return (
    <Box flex={true} style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "5px",
          cursor: "pointer"
        }}
        onClick={() => setDisplay(!display)}
      >
        <ViewIcon size="xsmall" colorIndex={display ? "grey-1" : "grey-3-a"} />
      </div>
      <SchemaTreeItem type="array" {...props} path={__path} />
      {display && (
        <Box flex={true} margin={{ left: "medium" }}>
          <HoverBox addProperty={props.addProperty} key={props.id} path={_path}>
            <div style={{ borderBottom: "5px solid #e6e6e6" }} />
            <Form
              schema={props.schema.items}
              uiSchema={props.uiSchema.items}
              formData={{}}
              tagName="div"
              widgets={widgets}
              showErrorList={false}
              FieldTemplate={FieldTemplate}
              ObjectFieldTemplate={ObjectFieldTemplate}
              ArrayFieldTemplate={ArrayFieldTemplate}
              liveValidate={true}
              validate={_validate}
              noHtml5Validate={true}
              formContext={_path}
            >
              <span />
            </Form>
          </HoverBox>
        </Box>
      )}
    </Box>
  );
};

ArrayFieldTemplate.propTypes = {
  rawErrors: PropTypes.array,
  formContext: PropTypes.object,
  addProperty: PropTypes.func,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  id: PropTypes.string
};
function mapDispatchToProps(dispatch) {
  return {
    addProperty: (path, data) => dispatch(addByPath(path, data))
  };
}

export default connect(
  state => state,
  mapDispatchToProps
)(ArrayFieldTemplate);
