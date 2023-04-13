import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Breadcrumb, Button, Col, Popconfirm, Row, Typography } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import Customize from "../containers/Customize";
import { DeleteOutlined } from "@ant-design/icons";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
const renderPath = pathToUpdate => {
  let prev;
  let content;
  const breadcrumbItems = [];

  let path = pathToUpdate.getIn(["path"]).toJS();

  path &&
    path.map(item => {
      if (breadcrumbItems.length == 0) {
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

      if (!prev) breadcrumbItems.push({ title: content });
    });

  if (prev) breadcrumbItems.push({ title: prev });

  return <Breadcrumb items={breadcrumbItems} />;
};
const PropertyEditor = ({ path, renameId, enableCreateMode, deleteByPath }) => {
  const [name, setName] = useState();
  const screens = useBreakpoint();

  useEffect(
    () => {
      if (path) {
        const p = path.getIn(["path"]).toJS();
        if (p.length) {
          setName(p.findLast(item => item !== "properties" && item != "items"));
        } else {
          setName("root");
        }
      }
    },
    [path]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <PageHeader
        onBack={enableCreateMode}
        title={screens.xl && "Field settings"}
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
        <Col xs={22} style={{ paddingBottom: "10px", textAlign: "center" }}>
          {renderPath(path)}
        </Col>
        <Col xs={18}>
          <Typography.Title
            level={5}
            editable={{
              text: name,
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
