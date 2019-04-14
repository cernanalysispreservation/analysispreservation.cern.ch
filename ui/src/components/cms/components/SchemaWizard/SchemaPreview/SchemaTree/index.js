import React from "react";
import { PropTypes } from "prop-types";

import Box from "grommet/components/Box";
import { connect } from "react-redux";

import Form from "react-jsonschema-form";
import SchemaTreeItem from "./SchemaTreeItem";

import HoverBox from "./HoverBox";
import { addByPath } from "../../../../../../actions/schemaWizard";

class SchemaTree extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Form
        schema={this.props.schema.toJS()}
        uiSchema={{}}
        formData={{}}
        showErrorList={false}
        tagName="div"
        FieldTemplate={_FieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        ArrayFieldTemplate={_ArrayFieldTemplate}
        liveValidate={true}
        validate={_validate}
        noHtml5Validate={true}
        formContext={{ schema: [], uiSchema: [] }}
      >
        <span />
      </Form>
    );
  }
}

let ObjectFieldTemplate = function(props) {
  if (props.idSchema.$id == "root") {
    return <Box>{props.properties.map(prop => prop.content)}</Box>;
  }
};

let ArrayFieldTemplate = function(props) {
  let { schema: schemaPath, uiSchema: uiSchemaPath } = props.rawErrors[0];
  let _path = {
    schema: [...props.formContext.schema, ...schemaPath, "items"],
    uiSchema: [...props.formContext.uiSchema, ...uiSchemaPath, "items"]
  };
  return (
    <Box flex={true}>
      <SchemaTreeItem type="array" {...props} path={_path} />

      <Box flex={true} margin={{ left: "medium" }}>
        <HoverBox addProperty={props.addProperty} key={props.id} path={_path}>
          <div style={{ borderBottom: "5px solid #e6e6e6" }} />
          <Form
            schema={props.schema.items}
            uiSchema={{}}
            formData={{}}
            tagName="div"
            showErrorList={false}
            FieldTemplate={_FieldTemplate}
            ObjectFieldTemplate={ObjectFieldTemplate}
            ArrayFieldTemplate={_ArrayFieldTemplate}
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

let FieldTemplate = function(props) {
  const { schema, rawErrors = [], children, formContext } = props;

  let path = {
    schema: [...formContext.schema, ...(rawErrors[0].schema || [])],
    uiSchema: [...formContext.uiSchema, ...(rawErrors[0].uiSchema || [])]
  };

  if (props.id == "root") {
    return (
      <HoverBox addProperty={props.addProperty} key={props.id} path={path}>
        <Box
          flex={true}
          pad={formContext.schema.length == 0 ? "medium" : "none"}
        >
          {children}
        </Box>
      </HoverBox>
    );
  }

  let _renderObjectArray = undefined;

  if (["array"].indexOf(schema.type) > -1) {
    _renderObjectArray = (
      <HoverBox addProperty={props.addProperty} key={props.id} path={path}>
        <Box>{children}</Box>
      </HoverBox>
    );
  } else if (["object"].indexOf(schema.type) > -1) {
    _renderObjectArray = (
      <Box flex={true}>
        <SchemaTreeItem type="object" {...props} path={path} />
        <Box flex={true} margin={{ left: "medium" }}>
          <Form
            schema={schema}
            uiSchema={{}}
            formData={{}}
            showErrorList={false}
            tagName="div"
            FieldTemplate={_FieldTemplate}
            ObjectFieldTemplate={ObjectFieldTemplate}
            ArrayFieldTemplate={_ArrayFieldTemplate}
            liveValidate={true}
            validate={_validate}
            noHtml5Validate={true}
            formContext={path}
          >
            <span />
          </Form>
        </Box>
      </Box>
    );
  }

  if (_renderObjectArray) {
    return (
      <HoverBox addProperty={props.addProperty} key={props.id} path={path}>
        {_renderObjectArray}
      </HoverBox>
    );
  }

  return <SchemaTreeItem type="other" {...props} path={path} />;
};

function mapDispatchToProps(dispatch) {
  return {
    addProperty: (path, data) => dispatch(addByPath(path, data))
  };
}

let _FieldTemplate = connect(
  state => state,
  mapDispatchToProps
)(FieldTemplate);

let _ArrayFieldTemplate = connect(
  state => state,
  mapDispatchToProps
)(ArrayFieldTemplate);

function _add(path, data) {
  this.props.add(path, data);
}

let _validate = function(formData, errors) {
  return _addErrors(errors, { schema: [], uiSchema: [] });
};

let _addErrors = (errors, path) => {
  errors.addError({ schema: path.schema, uiSchema: path.uiSchema });

  Object.keys(errors).map(error => {
    if (error != "__errors" && error != "addError") {
      _addErrors(errors[error], {
        schema: [...path, "properties", error],
        uiSchema: [...path, error]
      });
    }
  });
  return errors;
};

SchemaTree.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object
};

export default SchemaTree;
