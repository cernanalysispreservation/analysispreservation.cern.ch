import PropTypes from "prop-types";
import { Space, Typography } from "antd";
import Markdown from "../../../partials/Markdown";
import TitleField from "../../fields/internal/TitleField";

const FieldHeader = ({
  label,
  description,
  uiSchema,
  isObject,
  idSchema,
  titleField,
}) => {
  return (
    <Space direction="vertical" size={0}>
      {titleField && titleField}
      {uiSchema["ui:title"] !== false && label && (
        <TitleField
          title={label}
          titleIsMarkdown={
            uiSchema["ui:options"] && uiSchema["ui:options"].titleIsMarkdown
          }
          isObject={isObject}
          id={`${idSchema.$id}-title`}
        />
      )}
      {description && (
        <Typography.Text type="secondary" id={`${idSchema.$id}-description`}>
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
        </Typography.Text>
      )}
    </Space>
  );
};

FieldHeader.propTypes = {
  displayLabel: PropTypes.bool,
  label: PropTypes.string,
  uiSchema: PropTypes.object,
  description: PropTypes.node,
  isObject: PropTypes.bool,
  idSchema: PropTypes.object,
  titleField: PropTypes.element,
};

export default FieldHeader;
