import React from "react";
import PropTypes from "prop-types";
import { Button, Col, Row, Typography } from "antd";
import SchemaTree from "../containers/SchemaTree";
import { SettingOutlined } from "@ant-design/icons";

const SchemaPreview = ({ schema, selectProperty }) => {
  return (
    <div style={{ height: "80%" }}>
      <Row justify="center">
        <Col span={24}>
          <Typography.Title
            level={4}
            style={{ textAlign: "center", margin: "15px 0" }}
          >
            Schema tree
          </Typography.Title>
        </Col>
      </Row>
      <Row
        justify="space-between"
        style={{ paddingLeft: "10px", paddingRight: "10px" }}
      >
        <Typography.Title level={5}>
          {(schema && schema.get("title")) || "Root"}
        </Typography.Title>
        <Button
          type="link"
          shape="circle"
          icon={<SettingOutlined />}
          onClick={() => selectProperty({ schema: [], uiSchema: [] })}
        />
      </Row>
      <SchemaTree key="schemaTree" />
    </div>
  );
};

SchemaPreview.propTypes = {
  schema: PropTypes.object,
  selectProperty: PropTypes.func,
};

export default SchemaPreview;
