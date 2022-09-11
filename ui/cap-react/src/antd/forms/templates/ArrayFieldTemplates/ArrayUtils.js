import React from "react";
import { Button, Col } from "antd";
import ArrowUpOutlined from "@ant-design/icons/ArrowUpOutlined";
import ArrowDownOutlined from "@ant-design/icons/ArrowDownOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import PropTypes from "prop-types";

const BTN_GRP_STYLE = {
  width: "100%",
};

const BTN_STYLE = {
  width: "calc(100% / 3)",
};

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
    <Col flex="100px" style={{ padding: 0 }}>
      <Button.Group style={{ ...BTN_GRP_STYLE, justifyContent: "end" }}>
        {(hasMoveUp || hasMoveDown) && (
          <Button
            disabled={disabled || !hasMoveUp}
            icon={<ArrowUpOutlined />}
            onClick={onReorderClick(index, index - 1)}
            // style={BTN_STYLE}
            type="link"
          />
        )}

        {(hasMoveUp || hasMoveDown) && (
          <Button
            disabled={disabled || !hasMoveDown}
            icon={<ArrowDownOutlined />}
            onClick={onReorderClick(index, index + 1)}
            // style={BTN_STYLE}
            type="link"
          />
        )}

        {hasRemove && (
          <Button
            danger
            disabled={disabled}
            icon={<DeleteOutlined />}
            onClick={onDropIndexClick(index)}
            // style={BTN_STYLE}
            type="link"
          />
        )}
      </Button.Group>
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
