import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Button, Row, Space, Tooltip } from "antd";
import Text from "antd/lib/typography/Text";
import { ImportOutlined, MailOutlined } from "@ant-design/icons";
import Markdown from "../../partials/Markdown/Markdown";

const TitleField = ({
  formContext,
  id,
  prefixCls,
  required,
  title,
  uiEmail,
  uiImport,
  uiLatex,
  enableEmail,
  enableImport,
  enableLatex,
  readonly,
  titleIsMarkdown,
  isObject,
}) => {
  const { colon = true } = formContext;

  let labelChildren = title;
  if (colon && typeof title === "string" && title.trim() !== "") {
    labelChildren = title.replace(/[：:]\s*$/, "");
  }

  const labelClassName = classNames({
    [`${prefixCls}-item-required`]: required,
    [`${prefixCls}-item-no-colon`]: !colon,
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

  const titleText = (
    <Text
      style={{ fontSize: isObject && "12pt" }}
      strong
      className={labelClassName}
      htmlFor={id}
      onClick={handleLabelClick}
      title={typeof title === "string" ? title : ""}
      id={id}
    >
      <Markdown
        text={labelChildren}
        style={{
          color: "#000",
        }}
        renderAsHtml={titleIsMarkdown}
      />
    </Text>
  );

  if ((uiImport && !readonly) || uiLatex || uiEmail) {
    return (
      <Row justify="space-between">
        {titleText}
        <Space style={{ flexWrap: "wrap" }}>
          {uiImport && (
            <Tooltip title="Import from a list">
              <Button
                icon={<ImportOutlined />}
                block
                shape="round"
                size="small"
                onClick={enableImport}
              />
            </Tooltip>
          )}
          {uiLatex && (
            <Tooltip title="Export LaTeX">
              <Button
                icosn={<MailOutlined />}
                block
                shape="round"
                size="small"
                title="LaTeX"
                onClick={enableLatex}
              >
                LaTeX
              </Button>
            </Tooltip>
          )}
          {uiEmail && (
            <Tooltip title="Send email">
              <Button
                icon={<MailOutlined />}
                block
                shape="round"
                size="small"
                onClick={enableEmail}
              />
            </Tooltip>
          )}
        </Space>
      </Row>
    );
  }
  return <React.Fragment>{titleText}</React.Fragment>;
};

TitleField.propTypes = {
  formContext: PropTypes.object,
  id: PropTypes.string,
  prefixCls: PropTypes.string,
  required: PropTypes.bool,
  title: PropTypes.string,
  uiImport: PropTypes.bool,
  uiLatex: PropTypes.bool,
  enableLatex: PropTypes.func,
  enableImport: PropTypes.func,
};

TitleField.defaultProps = {
  formContext: {},
};

export default TitleField;
