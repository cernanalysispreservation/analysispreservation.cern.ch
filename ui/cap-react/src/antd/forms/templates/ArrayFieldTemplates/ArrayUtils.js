import { Button, Col, Row } from "antd";
import ArrowUpOutlined from "@ant-design/icons/ArrowUpOutlined";
import ArrowDownOutlined from "@ant-design/icons/ArrowDownOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import PropTypes from "prop-types";

const ArrayUtils = ({
  hasMoveUp,
  hasMoveDown,
  disabled,
  readonly,
  onReorderClick,
  onDropIndexClick,
  index,
  hasRemove,
}) => {
  return !readonly ? (
    <Col flex="none" style={{ padding: 0, margin: 0 }}>
      <Row gutter={4}>
        {(hasMoveUp || hasMoveDown) && (
          <Col>
            <Row>
              <Button
                disabled={disabled || !hasMoveUp}
                icon={<ArrowUpOutlined style={{ fontSize: "14px" }} />}
                onClick={onReorderClick(index, index - 1)}
                type="link"
                size="small"
                style={{ height: "16px" }}
              />
            </Row>
            <Row>
              <Button
                disabled={disabled || !hasMoveDown}
                icon={<ArrowDownOutlined style={{ fontSize: "14px" }} />}
                onClick={onReorderClick(index, index + 1)}
                type="link"
                size="small"
                style={{ height: "16px" }}
              />
            </Row>
          </Col>
        )}
        {hasRemove && (
          <Col>
            <Button
              danger
              disabled={disabled}
              icon={<DeleteOutlined />}
              onClick={onDropIndexClick(index)}
              type="link"
              size="small"
              style={{ height: "32px" }}
            />
          </Col>
        )}
      </Row>
    </Col>
  ) : null;
};

ArrayUtils.propTypes = {
  hasMoveDown: PropTypes.bool,
  hasMoveUp: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  hasRemove: PropTypes.bool,
  onReorderClick: PropTypes.func,
  onDropIndexClick: PropTypes.func,
  index: PropTypes.string,
};

export default ArrayUtils;
