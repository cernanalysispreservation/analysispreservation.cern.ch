import { Row, Col, Button } from "antd";
import PlusCircleOutlined from "@ant-design/icons/PlusCircleOutlined";
import PropTypes from "prop-types";
import ArrayFieldTemplateItem from "./ArrayFieldTemplateItem";
import FieldHeader from "../Field/FieldHeader";

const FixedArrayFieldTemplate = ({
  canAdd,
  className,
  disabled,
  formContext,
  idSchema,
  items,
  options,
  onAddClick,
  readonly,
  schema,
  title,
  uiSchema,
}) => {
  const { rowGutter = 24 } = formContext;

  return (
    <fieldset className={className} id={idSchema.$id}>
      <Row gutter={rowGutter}>
        <FieldHeader
          label={uiSchema["ui:title"] || title}
          description={uiSchema["ui:description"] || schema.description}
          uiSchema={uiSchema}
          idSchema={idSchema}
        />

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
                  <PlusCircleOutlined /> Add{" "}
                  {options && options.addLabel ? options.addLabel : `Item`}
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
  uiSchema: PropTypes.object,
};

export default FixedArrayFieldTemplate;
