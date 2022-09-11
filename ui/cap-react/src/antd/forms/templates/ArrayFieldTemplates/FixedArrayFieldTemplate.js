import React from "react";
import classNames from "classnames";

import { Row, Col, Button } from "antd";
import { withConfigConsumer } from "antd/lib/config-provider/context";
import PlusCircleOutlined from "@ant-design/icons/PlusCircleOutlined";
import PropTypes from "prop-types";
import ArrayFieldTemplateItem from "./ArrayFieldTemplateItem";

const DESCRIPTION_COL_STYLE = {
  paddingBottom: "8px",
};

const FixedArrayFieldTemplate = ({
  canAdd,
  className,
  DescriptionField,
  disabled,
  formContext,
  // formData,
  idSchema,
  items,
  onAddClick,
  prefixCls,
  readonly,
  // registry,
  required,
  schema,
  title,
  TitleField,
  uiSchema,
}) => {
  const { labelAlign = "right", rowGutter = 24 } = formContext;

  const labelClsBasic = `${prefixCls}-item-label`;
  const labelColClassName = classNames(
    labelClsBasic,
    labelAlign === "left" && `${labelClsBasic}-left`
    // labelCol.className,
  );

  return (
    <fieldset className={className} id={idSchema.$id}>
      <Row gutter={rowGutter}>
        {title && (
          <Col className={labelColClassName} span={24} style={{ padding: "0" }}>
            <TitleField
              id={`${idSchema.$id}__title`}
              key={`array-field-title-${idSchema.$id}`}
              required={required}
              title={uiSchema["ui:title"] || title}
            />
          </Col>
        )}

        {(uiSchema["ui:description"] || schema.description) && (
          <Col span={24} style={DESCRIPTION_COL_STYLE}>
            <DescriptionField
              description={uiSchema["ui:description"] || schema.description}
              id={`${idSchema.$id}-description`}
              key={`array-field-description-${idSchema.$id}`}
            />
          </Col>
        )}

        <Col span={24} style={{ marginTop: "5px" }} className="nestedObject">
          <Row>
            <Col className="row array-item-list" span={24}>
              {items &&
                items.map((itemProps, index) => (
                  <ArrayFieldTemplateItem
                    key={idSchema.$id + index}
                    {...itemProps}
                    formContext={formContext}
                  />
                ))}
            </Col>
          </Row>
        </Col>

        {canAdd && !readonly && (
          <Col span={24}>
            <Row gutter={rowGutter} justify="end">
              <Col flex="192px">
                <Button
                  block
                  className="array-item-add"
                  disabled={disabled}
                  onClick={onAddClick}
                  type="primary"
                >
                  <PlusCircleOutlined /> Add Item
                </Button>
              </Col>
            </Row>
          </Col>
        )}
      </Row>
    </fieldset>
  );
};

FixedArrayFieldTemplate.propTypes = {
  canAdd: PropTypes.bool,
  className: PropTypes.string,
  DescriptionField: PropTypes.node,
  disabled: PropTypes.bool,
  formContext: PropTypes.object,
  idSchema: PropTypes.object,
  items: PropTypes.array,
  onAddClick: PropTypes.func,
  prefixCls: PropTypes.string,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  schema: PropTypes.object,
  title: PropTypes.string,
  TitleField: PropTypes.node,
  uiSchema: PropTypes.object,
};

export default withConfigConsumer({ prefixCls: "form" })(
  FixedArrayFieldTemplate
);
