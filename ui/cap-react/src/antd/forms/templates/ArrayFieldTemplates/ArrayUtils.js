import React from "react";
import { Button, Col } from "antd";
import ArrowUpOutlined from "@ant-design/icons/ArrowUpOutlined";
import ArrowDownOutlined from "@ant-design/icons/ArrowDownOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import PropTypes from "prop-types";

const BTN_GRP_STYLE = {
  width: "100%"
};

const BTN_STYLE = {
  width: "calc(100% / 3)"
};

const ArrayUtils = ({
  hasMoveUp,
  hasMoveDown,
  disabled,
  readonly,
  onReorderClick,
  onDropIndexClick,
  index,
  hasRemove
}) => {
  return (
    <Col flex="192px">
      <Button.Group style={BTN_GRP_STYLE}>
        {(hasMoveUp || hasMoveDown) && (
          <Button
            disabled={disabled || readonly || !hasMoveUp}
            icon={<ArrowUpOutlined />}
            onClick={onReorderClick(index, index - 1)}
            style={BTN_STYLE}
            type="default"
          />
        )}

        {(hasMoveUp || hasMoveDown) && (
          <Button
            disabled={disabled || readonly || !hasMoveDown}
            icon={<ArrowDownOutlined />}
            onClick={onReorderClick(index, index + 1)}
            style={BTN_STYLE}
            type="default"
          />
        )}

        {hasRemove && (
          <Button
            danger
            disabled={disabled || readonly}
            icon={<DeleteOutlined />}
            onClick={onDropIndexClick(index)}
            style={BTN_STYLE}
            type="primary"
          />
        )}
      </Button.Group>
    </Col>
  );
};

ArrayUtils.propTypes = {
  hasMoveDown: PropTypes.bool,
  hasMoveUp: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  onReorderClick: PropTypes.bool,
  onDropIndexClick: PropTypes.bool,
  index: PropTypes.string,
  hasRemove: PropTypes.bool
};

export default ArrayUtils;
