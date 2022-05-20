import React from "react";
import { Row, Col } from "antd";
import PropTypes from "prop-types";
import ArrayUtils from "./ArrayUtils";

const ArrayFieldTemplateItem = ({
  children,
  disabled,
  formContext,
  hasMoveDown,
  hasMoveUp,
  hasRemove,
  hasToolbar,
  index,
  onDropIndexClick,
  onReorderClick,
  readonly
}) => {
  const { rowGutter = 24, toolbarAlign = "top" } = formContext;

  return (
    <Row
      align={toolbarAlign}
      key={`array-item-${index}`}
      gutter={rowGutter}
      style={{ marginTop: "24px" }}
    >
      <Col flex="1" style={{ borderBottom: "1px solid #f0f0f0" }}>
        {children}
      </Col>
      {hasToolbar && (
        <ArrayUtils
          hasMoveDown={hasMoveDown}
          hasMoveUp={hasMoveUp}
          disabled={disabled}
          readonly={readonly}
          onReorderClick={onReorderClick}
          index={index}
          hasRemove={hasRemove}
          onDropIndexClick={onDropIndexClick}
        />
      )}
    </Row>
  );
};

ArrayFieldTemplateItem.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  formContext: PropTypes.object,
  hasMoveDown: PropTypes.bool,
  hasMoveUp: PropTypes.bool,
  hasRemove: PropTypes.bool,
  hasToolbar: PropTypes.bool,
  index: PropTypes.string,
  onDropIndexClick: PropTypes.func,
  onReorderClick: PropTypes.func,
  readonly: PropTypes.bool
};

ArrayFieldTemplateItem.defaultProps = {
  formContext: {}
};

export default ArrayFieldTemplateItem;
