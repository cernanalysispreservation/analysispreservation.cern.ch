import { ADDITIONAL_PROPERTY_FLAG } from "@rjsf/utils";
import { Button, Col, Form, Input, Row } from "antd";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import PropTypes from "prop-types";

const VERTICAL_LABEL_COL = { span: 24 };
const VERTICAL_WRAPPER_COL = { span: 24 };

const INPUT_STYLE = {
  width: "100%",
};

const WrapIfAdditional = ({
  children,
  classNames,
  disabled,
  formContext,
  id,
  label,
  onDropPropertyClick,
  onKeyChange,
  readonly,
  required,
  schema,
  isTabView,
}) => {
  const {
    colon,
    labelCol = VERTICAL_LABEL_COL,
    readonlyAsDisabled = true,
    rowGutter = 24,
    toolbarAlign = "top",
    wrapperCol = VERTICAL_WRAPPER_COL,
    wrapperStyle,
  } = formContext;

  const keyLabel = `${label} Key`; // i18n ?
  const additional = schema.hasOwnProperty(ADDITIONAL_PROPERTY_FLAG);

  if (!additional) {
    return (
      <div
        className={classNames}
        style={{ height: id == "root" && isTabView && "100%" }}
      >
        {children}
      </div>
    );
  }

  const handleBlur = ({ target }) => onKeyChange(target.value);

  return (
    <div className={classNames}>
      <Row align={toolbarAlign} gutter={rowGutter}>
        <Col className="form-additional" flex="1">
          <div className="form-group">
            <Form.Item
              colon={colon}
              className="form-group"
              hasFeedback
              htmlFor={`${id}-key`}
              label={keyLabel}
              labelCol={labelCol}
              required={required}
              style={wrapperStyle}
              wrapperCol={wrapperCol}
            >
              <Input
                className="form-control"
                defaultValue={label}
                disabled={disabled || (readonlyAsDisabled && readonly)}
                id={`${id}-key`}
                name={`${id}-key`}
                onBlur={!readonly ? handleBlur : undefined}
                style={INPUT_STYLE}
                type="text"
              />
            </Form.Item>
          </div>
        </Col>
        <Col className="form-additional" flex="1">
          {children}
        </Col>
        <Col flex="192px">
          <Button
            block
            className="array-item-remove"
            danger
            disabled={disabled || readonly}
            icon={<DeleteOutlined />}
            onClick={onDropPropertyClick(label)}
            type="primary"
          />
        </Col>
      </Row>
    </div>
  );
};

WrapIfAdditional.propTypes = {
  classNames: PropTypes.string,
  disabled: PropTypes.bool,
  formContext: PropTypes.object,
  onDropPropertyClick: PropTypes.func,
  onKeyChange: PropTypes.func,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  isTabView: PropTypes.bool,
  schema: PropTypes.object,
  label: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.node,
};

export default WrapIfAdditional;
