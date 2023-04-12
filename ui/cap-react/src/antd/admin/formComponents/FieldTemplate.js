import React, { useState } from "react";
import PropTypes from "prop-types";
import HoverBox from "./HoverBox";
import SchemaTreeItem from "./SchemaTreeItem";
import Form from "../../forms/Form";
import ArrayFieldTemplate from "./ArrayFieldTemplate";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import { connect } from "react-redux";
import { addByPath } from "../../../actions/schemaWizard";
import { isItTheArrayField, _validate } from "../utils/index";
import DropArea from "./DropArea";

const FieldTemplate = props => {
  const {
    schema,
    uiSchema = {},
    rawErrors = [],
    children,
    formContext,
    id,
    addProperty,
  } = props;

  const [display, setDisplay] = useState(false);
  let path = {
    schema: [...formContext.schema, ...(rawErrors[0].schema || [])],
    uiSchema: [...formContext.uiSchema, ...(rawErrors[0].uiSchema || [])],
  };

  const shouldBoxHideChildren = uiSchema => {
    return uiSchema["ui:field"] !== undefined;
  };

  // The content of a JSON Object field is also considered a 'root'
  if (id == "root" && !formContext.nestedForm) {
    const inside = (
      <div
        style={{
          padding: formContext.schema.length == 0 ? "10px" : "none",
        }}
      >
        {children}
        <DropArea />
      </div>
    );
    if (formContext.schema.length == 0) {
      return (
        <HoverBox
          allowsChildren
          addProperty={addProperty}
          key={id}
          path={path}
          shouldHideChildren={shouldBoxHideChildren(uiSchema)}
        >
          {inside}
        </HoverBox>
      );
    }
    return inside;
  }

  let _renderObjectArray = undefined;

  if (isItTheArrayField(schema, uiSchema)) {
    _renderObjectArray = <div>{children}</div>;
  } else if (["object"].indexOf(schema.type) > -1) {
    _renderObjectArray = (
      <div>
        <SchemaTreeItem
          type="object"
          {...props}
          path={path}
          display={display}
          updateDisplay={() => setDisplay(!display)}
        />
        {display ? (
          <div style={{ marginLeft: "10px" }}>
            <Form
              schema={schema}
              uiSchema={uiSchema}
              formData={{}}
              FieldTemplate={_FieldTemplate}
              ObjectFieldTemplate={ObjectFieldTemplate}
              ArrayFieldTemplate={ArrayFieldTemplate}
              liveValidate={true}
              validate={_validate}
              formContext={path}
              onChange={() => {}}
            >
              <span />
            </Form>
          </div>
        ) : null}
      </div>
    );
  }

  if (_renderObjectArray) {
    return (
      // The HoverBox wrapper here is needed to allow dropping items into objects
      // or arrays directly without having to expand them first
      <HoverBox
        addProperty={addProperty}
        key={id}
        path={path}
        shouldHideChildren={shouldBoxHideChildren(uiSchema)}
      >
        {_renderObjectArray}
      </HoverBox>
    );
  }

  return <SchemaTreeItem type="other" {...props} path={path} />;
};

FieldTemplate.propTypes = {
  id: PropTypes.string,
  children: PropTypes.element,
  formContext: PropTypes.object,
  rawErrors: PropTypes.array,
  uiSchema: PropTypes.object,
  schema: PropTypes.object,
  addProperty: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    addProperty: (path, data) => dispatch(addByPath(path, data)),
  };
}

let _FieldTemplate = connect(
  state => state,
  mapDispatchToProps
)(FieldTemplate);

export default _FieldTemplate;
