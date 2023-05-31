import React from "react";
import PropTypes from "prop-types";
import { Space, Typography } from "antd";
import Markdown from "../../../partials/Markdown";
import TitleField from "../../fields/TitleField";

const FieldHeader = ({ label, description, uiSchema, isObject }) => {
  return (
    <Space direction="vertical" size={0}>
      {label && (
        <TitleField
          title={label}
          titleIsMarkdown={
            uiSchema["ui:options"] && uiSchema["ui:options"].titleIsMarkdown
          }
          isObject={isObject}
        />
      )}
      <Typography.Text type="secondary">
        {description && (
          <Markdown
            text={description}
            style={{
              color: "#000",
            }}
            renderAsHtml={
              uiSchema["ui:options"] &&
              uiSchema["ui:options"].descriptionIsMarkdown
            }
          />
        )}
      </Typography.Text>
    </Space>
  );
};

FieldHeader.propTypes = {
  displayLabel: PropTypes.bool,
  label: PropTypes.string,
  uiSchema: PropTypes.object,
  description: PropTypes.node,
  isObject: PropTypes.bool,
};

export default FieldHeader;
