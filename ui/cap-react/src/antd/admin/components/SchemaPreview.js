import React from "react";
import PropTypes from "prop-types";
import { Col, Divider, Typography } from "antd";
import SchemaTree from "../containers/SchemaTree";

const SchemaPreview = ({ schema }) => {
  return (
    <Col span={24}>
      <Divider orientation="left">
        <Typography.Title level={5}>
          {(schema && schema.get("title")) || "Root"}
        </Typography.Title>
      </Divider>
      <SchemaTree key="schemaTree" />
    </Col>
  );
};

SchemaPreview.propTypes = {};

export default SchemaPreview;
