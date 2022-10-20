import React from "react";

import Form from "antd/lib/form";
import PropTypes from "prop-types";
import FieldHeader from "./FieldHeader";

import WrapIfAdditional from "./WrapIfAdditional";
import { Col, Row } from "antd";

const VERTICAL_LABEL_COL = { span: 24 };
const VERTICAL_WRAPPER_COL = { span: 24 };

const FieldTemplate = ({
  children,
  classNames,
  // description,
  disabled,
  displayLabel,
  // errors,
  // fields,
  formContext,
  help,
  hidden,
  id,
  label,
  onDropPropertyClick,
  onKeyChange,
  rawErrors,
  rawHelp,
  readonly,
  required,
  schema,
  uiSchema,
  rawDescription,
}) => {
  const {
    colon,
    labelCol = VERTICAL_LABEL_COL,
    wrapperCol = VERTICAL_WRAPPER_COL,
    wrapperStyle,
  } = formContext;

  if (hidden) {
    return <div className="field-hidden">{children}</div>;
  }

  const renderFieldErrors = () =>
    [...new Set(rawErrors)].map((error) => (
      <div key={`field-${id}-error-${error}`}>{error}</div>
    ));
  // let gridColumns = null;

  const { ["ui:options"]: uiOptions = {} } = uiSchema;
  // if the grid options exists in uiSchema pass it as prop
  // else set it full width
  // if (uiSchema["ui:options"] && uiSchema["ui:options"].grid) {
  //   gridColumns = uiSchema["ui:options"].grid.gridColumns
  //     ? uiSchema["ui:options"].grid.gridColumns
  //     : "1/5";
  // }

  const getJustify = () => {
    if (uiOptions.justify in ["start", "center", "end"]) {
      return uiOptions.justify;
    } else return "center";
  };
  let content = (
    <WrapIfAdditional
      classNames={classNames}
      disabled={disabled}
      formContext={formContext}
      id={id}
      label={label}
      onDropPropertyClick={onDropPropertyClick}
      onKeyChange={onKeyChange}
      readonly={readonly}
      required={required}
      schema={schema}
      isTabView={uiSchema["ui:object"] == "tabView"}
    >
      {id === "root" ? (
        children
      ) : (
        <Form.Item
          colon={colon}
          hasFeedback={schema.type !== "array" && schema.type !== "object"}
          help={(!!rawHelp && help) || (!!rawErrors && renderFieldErrors())}
          htmlFor={id}
          label={
            (displayLabel || uiSchema["ui:field"]) &&
            label && (
              <FieldHeader
                label={label}
                description={rawDescription}
                uiSchema={uiSchema}
              />
            )
          }
          labelCol={labelCol}
          required={required}
          style={wrapperStyle}
          validateStatus={rawErrors ? "error" : undefined}
          wrapperCol={wrapperCol}
        >
          {children}
        </Form.Item>
      )}
    </WrapIfAdditional>
  );

  if (id != "root" || uiSchema["ui:object"] == "tabView") return content;
  else {
    return (
      <Row justify={getJustify()}>
        <Col xs={22} sm={18} md={16} lg={16} xl={16}>
          {content}
        </Col>
      </Row>
    );
  }
};

FieldTemplate.propTypes = {
  displayLabel: PropTypes.bool,
  classNames: PropTypes.string,
  disabled: PropTypes.bool,
  formContext: PropTypes.object,
  rawErrors: PropTypes.array,
  onDropPropertyClick: PropTypes.func,
  onKeyChange: PropTypes.func,
  description: PropTypes.string,
  rawDescription: PropTypes.string,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  hidden: PropTypes.bool,
  schema: PropTypes.object,
  help: PropTypes.string,
  label: PropTypes.string,
  rawHelp: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.node,
  uiSchema: PropTypes.object,
};

export default FieldTemplate;
