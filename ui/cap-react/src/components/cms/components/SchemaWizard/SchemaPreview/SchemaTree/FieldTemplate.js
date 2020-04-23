import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import HoverBox from "./HoverBox";
import ViewIcon from "grommet/components/icons/base/View";
import SchemaTreeItem from "./SchemaTreeItem";
import Form from "react-jsonschema-form";
import TextWidget from "./TextWidget";
import ArrayFieldTemplate from "./ArrayFieldTemplate";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import { connect } from "react-redux";
import { addByPath } from "../../../../../../actions/schemaWizard";
import { _validate } from "./utils/validate";

const widgets = {
  TextWidget: TextWidget
};

const FieldTemplate = props => {
  const { schema, uiSchema, rawErrors = [], children, formContext } = props;

  const [display, setDisplay] = useState(true);
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
      <Box flex={true} style={{ position: "relative", overflow: "visible" }}>
        <div
          style={{
            position: "absolute",
            top: "15px",
            left: "-15px",
            cursor: "pointer"
          }}
          onClick={() => setDisplay(!display)}
        >
          <ViewIcon
            size="xsmall"
            colorIndex={display ? "grey-1" : "grey-3-a"}
          />
        </div>

        <SchemaTreeItem type="object" {...props} path={path} />
        {display ? (
          <Box flex={true} margin={{ left: "medium" }}>
            <Form
              schema={schema}
              uiSchema={uiSchema}
              formData={{}}
              showErrorList={false}
              widgets={widgets}
              tagName="div"
              FieldTemplate={_FieldTemplate}
              ObjectFieldTemplate={ObjectFieldTemplate}
              ArrayFieldTemplate={ArrayFieldTemplate}
              liveValidate={true}
              validate={_validate}
              noHtml5Validate={true}
              formContext={path}
            >
              <span />
            </Form>
          </Box>
        ) : null}
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

FieldTemplate.propTypes = {
  id: PropTypes.string,
  children: PropTypes.element,
  formContext: PropTypes.object,
  rawErrors: PropTypes.array,
  uiSchema: PropTypes.object,
  schema: PropTypes.object,
  addProperty: PropTypes.func
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

export default _FieldTemplate;
