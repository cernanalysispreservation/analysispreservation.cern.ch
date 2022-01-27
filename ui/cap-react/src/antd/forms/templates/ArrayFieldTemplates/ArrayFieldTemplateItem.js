import React from "react";
import { Row, Col } from "antd";

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
      style={{ marginBottom: "10px" }}
    >
      <Col flex="1" style={{ background: "rgba(240,242,245)" }}>
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

ArrayFieldTemplateItem.defaultProps = {
  formContext: {}
};

export default ArrayFieldTemplateItem;
