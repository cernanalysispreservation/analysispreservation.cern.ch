import React from "react";

import Form from "antd/lib/form";

import WrapIfAdditional from "./WrapIfAdditional";
import { Space, Typography } from "antd";

const VERTICAL_LABEL_COL = { span: 24 };
const VERTICAL_WRAPPER_COL = { span: 24 };

const FieldTemplate = ({
  children,
  classNames,
  description,
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
  uiSchema
}) => {
  const {
    colon,
    labelCol = VERTICAL_LABEL_COL,
    wrapperCol = VERTICAL_WRAPPER_COL,
    wrapperStyle
  } = formContext;

  if (hidden) {
    return <div className="field-hidden">{children}</div>;
  }

  const renderFieldErrors = () =>
    [...new Set(rawErrors)].map(error => (
      <div key={`field-${id}-error-${error}`}>{error}</div>
    ));
  let gridColumns = null;

  // if the grid options exists in uiSchema pass it as prop
  // else set it full width
  if (uiSchema["ui:options"] && uiSchema["ui:options"].grid) {
    gridColumns = uiSchema["ui:options"].grid.gridColumns
      ? uiSchema["ui:options"].grid.gridColumns
      : "1/5";
  }

  return (
    <div
      style={{
        gridColumn: gridColumns ? gridColumns : "1 / 5",
        height: id == "root" && uiSchema["ui:object"] == "tabView" && "100%"
        // padding:
        //   id == "root"
        //     ? null
        //     : schema.type !== "array" && schema.type !== "object" && "10px 24px"
      }}
    >
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
            // extra={description}
            hasFeedback={schema.type !== "array" && schema.type !== "object"}
            help={(!!rawHelp && help) || (!!rawErrors && renderFieldErrors())}
            htmlFor={id}
            label={
              displayLabel &&
              label && (
                <Space direction="vertical" size={0}>
                  <Typography.Text>{displayLabel && label}</Typography.Text>
                  <Typography.Text type="secondary">
                    {description}
                  </Typography.Text>
                </Space>
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
    </div>
  );
};

export default FieldTemplate;
