import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withConfigConsumer } from "antd/lib/config-provider/context";
import { Button, Row, Space } from "antd";

const TitleField = ({
  formContext,
  id,
  prefixCls,
  required,
  title,
  uiImport,
  uiLatex,
  enableLatex,
  enableImport
}) => {
  const { colon = true } = formContext;

  let labelChildren = title;
  if (colon && typeof title === "string" && title.trim() !== "") {
    labelChildren = title.replace(/[：:]\s*$/, "");
  }

  const labelClassName = classNames({
    [`${prefixCls}-item-required`]: required,
    [`${prefixCls}-item-no-colon`]: !colon
  });

  const handleLabelClick = () => {
    if (!id) {
      return;
    }

    const control = document.querySelector(`[id="${id}"]`);
    if (control && control.focus) {
      control.focus();
    }
  };

  if (!title) return null;

  if (uiImport || uiLatex) {
    return (
      <Row justify="space-between">
        <label
          className={labelClassName}
          htmlFor={id}
          onClick={handleLabelClick}
          title={typeof title === "string" ? title : ""}
        >
          {labelChildren}
        </label>
        <Space style={{ flexWrap: "wrap" }}>
          {uiImport && (
            <Button type="link" onClick={enableImport}>
              Import from a list
            </Button>
          )}
          {uiLatex && (
            <Button type="link" onClick={enableLatex}>
              Export LaTeX
            </Button>
          )}
        </Space>
      </Row>
    );
  }
  return (
    <label
      className={labelClassName}
      htmlFor={id}
      onClick={handleLabelClick}
      title={typeof title === "string" ? title : ""}
    >
      {labelChildren}
    </label>
  );
};

TitleField.defaultProps = {
  formContext: {}
};

TitleField.propTypes = {
  formContext: PropTypes.object,
  id: PropTypes.string,
  prefixCls: PropTypes.string,
  required: PropTypes.bool,
  title: PropTypes.string,
  uiImport: PropTypes.object,
  uiLatex: PropTypes.object,
  enableImport: PropTypes.func,
  enableLatex: PropTypes.func
};

export default withConfigConsumer({ prefixCls: "form" })(TitleField);
