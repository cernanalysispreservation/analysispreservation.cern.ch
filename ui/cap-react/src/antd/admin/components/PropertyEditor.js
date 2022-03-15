import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Button,
  Card,
  Modal,
  PageHeader,
  Space,
  Tag,
  Typography
} from "antd";
import EditableField from "../../partials/EditableField";
import Customize from "../containers/Customize";
const renderPath = (pathToUpdate, rename) => {
  let prev;
  let content;
  let result = [];

  let path = pathToUpdate.getIn(["path"]).toJS();

  path &&
    path.map(item => {
      if (result.length == 0) {
        if (item == "properties") content = "{ } root";
        else if (item == "items") content = "[ ] root";
      } else {
        if (item == "properties") {
          content = `{ } ${prev || ""}`;
          prev = null;
        } else if (item == "items") {
          content = `[ ] ${prev || ""}`;
          prev = null;
        } else prev = item;
      }

      if (!prev) result.push(<Tag>{content}</Tag>);
    });

  if (prev)
    result.push(
      <Tag color="geekblue">
        <EditableField
          text={prev}
          isEditable
          emptyValue={prev}
          onUpdate={value => rename(pathToUpdate.toJS(), value)}
        />
      </Tag>
    );

  if (result.length == 0) result.push(<Tag>root</Tag>);

  return result;
};
const PropertyEditor = ({ path, renameId, enableCreateMode, deleteByPath }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <Modal
        title="Delete Item"
        visible={showModal}
        onCancel={() => setShowModal(false)}
        okType="danger"
        okText="Delete"
        okButtonProps={{
          onClick: () => {
            deleteByPath(path.toJS());
            enableCreateMode();
          }
        }}
      >
        <Alert
          message="You are about to delete the following field"
          description={
            <Typography.Text code>
              {path
                .toJS()
                .path.filter(item => item != "properties" && item != "items")
                .map(item => item)
                .join(" > ")}
            </Typography.Text>
          }
          type="error"
          showIcon
        />
      </Modal>
      <PageHeader
        onBack={enableCreateMode}
        title={"Add new"}
        extra={
          path.get("path").size > 0 && (
            <Button onClick={() => setShowModal(true)} danger>
              Delete
            </Button>
          )
        }
      />
      <Space direction="vertical" style={{ width: "100%" }}>
        <Card title={"Selected Field"}>{renderPath(path, renameId)}</Card>
        <Customize path={path} key="customize" />
      </Space>
    </div>
  );
};

PropertyEditor.propTypes = {
  path: PropTypes.object,
  renameId: PropTypes.func,
  enableCreateMode: PropTypes.func,
  deleteByPath: PropTypes.func
};

export default PropertyEditor;
