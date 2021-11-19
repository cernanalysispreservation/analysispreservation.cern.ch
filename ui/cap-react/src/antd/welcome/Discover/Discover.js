import React from "react";
import { Typography, Row, Col, Space } from "antd";

const Discover = () => {
  return (
    <Row
      justify="center"
      align="middle"
      style={{ textAlign: "center", minHeight: "45vh" }}
      id="discover"
    >
      <Col xs={22} sm={18} md={14} lg={10} xl={6}>
        <Space direction="vertical" size="large">
          <Typography.Title>Discover the platform</Typography.Title>
          <Typography.Paragraph italic>
            CERN Analysis Preservation (CAP) is a service for researchers to
            preserve and document the various components of their physics
            analyses, e.g. datasets, software, documentation, so that they are
            reusable and understandable in the future. By using this tool,
            researchers ensure these outputs are preserved, findable and
            accessible by their collaborators for the long-term.
          </Typography.Paragraph>
          <Typography.Paragraph italic>
            CAP uses existing collaboration tools and a flexible data model, and
            it is designed to be easily integrated into researchers' workflows.
            CAP provides standard collaboration access restrictions so that the
            individual users and collaborations are in full control of sharing
            their results.
          </Typography.Paragraph>
        </Space>
      </Col>
    </Row>
  );
};

Discover.propTypes = {};

export default Discover;
