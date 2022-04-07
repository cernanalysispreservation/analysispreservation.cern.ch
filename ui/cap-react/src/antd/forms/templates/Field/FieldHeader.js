import React from "react";
import PropTypes from "prop-types";
import { Space, Typography } from "antd";
import Markdown from "../../../partials/Markdown";

const FieldHeader = ({ label, description, uiSchema }) => {
  return (
    <Space direction="vertical" size={0}>
      <Typography.Text>
        {label && (
          <Markdown
            text={label}
            style={{
              color: "#000"
            }}
            renderAsHtml={
              uiSchema["ui:options"] && uiSchema["ui:options"].titleIsMarkdown
            }
          />
        )}
      </Typography.Text>
      <Typography.Text type="secondary">
        {description.props && (
          <Markdown
            text={description.props.description}
            style={{
              color: "#000"
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
  description: PropTypes.node
};

export default FieldHeader;
