import React, { useState } from "react";
import PropTypes from "prop-types";
import SchemaTreeItem from "./SchemaTreeItem";
import HoverBox from "./HoverBox";
import Form from "../../forms/Form";
import TextWidget from "./TextWidget";
import { connect } from "react-redux";
import { addByPath } from "../../../actions/schemaWizard";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import FieldTemplate from "./FieldTemplate";
import { _validate } from "../utils";

const widgets = {
  TextWidget: TextWidget
};

const ArrayFieldTemplate = props => {
  const [display, setDisplay] = useState(false);

  let schemaPath = [];
  let uiSchemaPath = [];
  if (props.rawErrors) {
    let { schema, uiSchema } = props.rawErrors[0];
    schemaPath = schema;
    uiSchemaPath = uiSchema;
  }

  let _path = {
    schema: [...props.formContext.schema, ...schemaPath, "items"],
    uiSchema: [...props.formContext.uiSchema, ...uiSchemaPath, "items"]
  };

  let __path = {
    schema: [...props.formContext.schema, ...schemaPath],
    uiSchema: [...props.formContext.uiSchema, ...uiSchemaPath]
  };

  return (
    <div>
      <SchemaTreeItem
        type="array"
        {...props}
        path={__path}
        display={display}
        updateDisplay={() => setDisplay(!display)}
      />
      {display && (
        <div style={{ marginLeft: "10px" }}>
          <HoverBox addProperty={props.addProperty} key={props.id} path={_path}>
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
              onChange={() => {}}
              formContext={_path}
            >
              <span />
            </Form>
          </HoverBox>
        </div>
      )}
    </div>
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
