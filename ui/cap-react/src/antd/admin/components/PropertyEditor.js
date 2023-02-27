import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Breadcrumb,
  Button,
  Col,
  PageHeader,
  Popconfirm,
  Row,
  Typography,
} from "antd";
import Customize from "../containers/Customize";
import { DeleteOutlined } from "@ant-design/icons";
const renderPath = pathToUpdate => {
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

      if (!prev) result.push(<Breadcrumb.Item>{content}</Breadcrumb.Item>);
    });

  if (prev) result.push(<Breadcrumb.Item>{prev}</Breadcrumb.Item>);

  if (result.length == 0) result.push(<Breadcrumb.Item>root</Breadcrumb.Item>);

  return <Breadcrumb>{result}</Breadcrumb>;
};
const PropertyEditor = ({ path, renameId, enableCreateMode, deleteByPath }) => {
  const [name, setName] = useState();

  useEffect(
    () => {
      if (path) {
        const p = path.getIn(["path"]).toJS();
        if (p.length) {
          setName(p.find(item => item !== "properties" && item != "items"));
        } else {
          setName("root");
        }
      }
    },
    [path]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <PageHeader
        onBack={enableCreateMode}
        title="Show Fields"
        extra={
          path.get("path").size > 0 && (
            <Popconfirm
              title="Delete field"
              okType="danger"
              okText="Delete"
              cancelText="Cancel"
              onConfirm={() => {
                deleteByPath(path.toJS());
                enableCreateMode();
              }}
            >
              <Button danger shape="circle" icon={<DeleteOutlined />} />
            </Popconfirm>
          )
        }
      />
      <Row justify="center">
        <Col xs={22} style={{ paddingBottom: "20px", textAlign: "center" }}>
          {renderPath(path)}
        </Col>
        <Col xs={22}>
          <Typography.Title
            level={5}
            editable={{
              text: { name },
              onChange: value => renameId(path.toJS(), value),
            }}
            style={{ textAlign: "center" }}
          >
            {name}
          </Typography.Title>
        </Col>
      </Row>
      <Customize path={path} />
    </div>
  );
};

PropertyEditor.propTypes = {
  path: PropTypes.object,
  renameId: PropTypes.func,
  enableCreateMode: PropTypes.func,
  deleteByPath: PropTypes.func,
};

export default PropertyEditor;
