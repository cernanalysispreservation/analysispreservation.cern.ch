import { useState } from "react";
import PropTypes from "prop-types";
import SchemaTreeItem from "./SchemaTreeItem";
import Form from "../../forms/Form";
import { connect } from "react-redux";
import { addByPath } from "../../../actions/schemaWizard";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import FieldTemplate from "./FieldTemplate";
import { _validate } from "../utils";
import DropArea from "./DropArea";

const ArrayFieldTemplate = props => {
  const [display, setDisplay] = useState(false);

  let schemaPath = [];
  let uiSchemaPath = [];
  if (props.rawErrors) {
    let _rawErrors = props.rawErrors.filter(i => (i.schema ? i : false));
    let { schema, uiSchema } = _rawErrors[0];
    schemaPath = schema;
    uiSchemaPath = uiSchema;
  }

  let _path = {
    schema: [...props.formContext.schema, ...schemaPath, "items"],
    uiSchema: [...props.formContext.uiSchema, ...uiSchemaPath, "items"],
  };

  let __path = {
    schema: [...props.formContext.schema, ...schemaPath],
    uiSchema: [...props.formContext.uiSchema, ...uiSchemaPath],
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
          {Object.keys(props.schema.items).length == 0 ? (
            <DropArea />
          ) : (
            <Form
              schema={props.schema.items}
              uiSchema={props.uiSchema.items}
              formData={{}}
              tagName="div"
              showErrorList={false}
              FieldTemplate={FieldTemplate}
              ObjectFieldTemplate={ObjectFieldTemplate}
              ArrayFieldTemplate={ArrayFieldTemplate}
              liveValidate={true}
              validate={_validate}
              noHtml5Validate={true}
              onChange={() => {}}
              formContext={{ ..._path, nestedForm: true }}
            >
              <span />
            </Form>
          )}
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
  id: PropTypes.string,
};
function mapDispatchToProps(dispatch) {
  return {
    addProperty: (path, data) => dispatch(addByPath(path, data)),
  };
}

export default connect(
  state => state,
  mapDispatchToProps
)(ArrayFieldTemplate);
