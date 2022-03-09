import React from "react";
import PropTypes from "prop-types";
import { Row, Typography } from "antd";

const SchemaPreview = ({ schema }) => {
  return (
    <Row style={{ height: "100%" }}>
      <Typography.Title level={5}>
        {(schema && schema.get("title")) || "Root"}
      </Typography.Title>
    </Row>
  );
};

SchemaPreview.propTypes = {};

export default SchemaPreview;
