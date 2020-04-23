import React from "react";
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

const widgets = {
  TextWidget: TextWidget
};

const ArrayFieldTemplate = props => {
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
    <Box flex={true}>
      <SchemaTreeItem type="array" {...props} path={__path} />
      <Box flex={true} margin={{ left: "medium" }}>
        <HoverBox addProperty={props.addProperty} key={props.id} path={_path}>
          <div style={{ borderBottom: "5px solid #e6e6e6" }} />
          <Form
            schema={props.schema.items}
            uiSchema={{}}
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
    </Box>
  );
};

ArrayFieldTemplate.propTypes = {
  rawErrors: PropTypes.array,
  formContext: PropTypes.object,
  addProperty: PropTypes.func,
  schema: PropTypes.object,
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
