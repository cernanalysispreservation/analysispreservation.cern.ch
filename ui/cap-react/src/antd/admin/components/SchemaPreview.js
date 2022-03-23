import React from "react";
import PropTypes from "prop-types";
import { Col, Divider, Space, Typography } from "antd";
import SchemaTree from "../containers/SchemaTree";
import { SettingOutlined } from "@ant-design/icons";

const SchemaPreview = ({ schema, selectProperty }) => {
  return (
    <Col span={24} style={{ height: "90%" }}>
      <Divider orientation="left">
        <Space onClick={() => selectProperty({ schema: [], uiSchema: [] })}>
          <SettingOutlined />
          <Typography.Title style={{ margin: 0 }} level={5}>
            {(schema && schema.get("title")) || "Root"}
          </Typography.Title>
        </Space>
      </Divider>
      <SchemaTree key="schemaTree" />
    </Col>
  );
};

SchemaPreview.propTypes = {
  schema: PropTypes.object,
  selectProperty: PropTypes.func,
};

export default SchemaPreview;
