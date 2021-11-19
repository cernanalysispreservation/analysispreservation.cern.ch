import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Typography, Space } from "antd";
import { GithubOutlined, GitlabOutlined } from "@ant-design/icons";

const Integrations = props => {
  return (
    <Row align="middle" style={{ minHeight: "45vh" }}>
      <Col span={12} offset={6}>
        <Typography.Title>Integrations</Typography.Title>
      </Col>
      <Col span={8} offset={6}>
        <Typography.Title level={5}>Source Code</Typography.Title>
        <Typography.Paragraph>
          Attach code to your workspace. Connect your Github and CERN Gitlab
          accounts, follow repository changes and automatically keep snapshots
          of your work and of the tools/libraries you use.
        </Typography.Paragraph>
      </Col>
      <Col span={4} offset={4}>
        <GithubOutlined />
        <GitlabOutlined />
      </Col>
      <Col span={4} offset={6}>
        <GithubOutlined />
        <GitlabOutlined />
      </Col>
      <Col span={7} offset={1} style={{ textAlign: "right" }}>
        <Typography.Title level={5}>
          Persistent Identifiers/FAIR data
        </Typography.Title>
        <Typography.Paragraph>
          Preserve your analysis in a FAIR manner (Findable Accesible
          Interoperable Reusable). Use persistent identifiers (PIDs) to capture
          and connect your analysis components. Make your work citable by
          pushing it to external services that provide PIDs.
        </Typography.Paragraph>
      </Col>
      <Col span={8} offset={6}>
        <Typography.Title level={5}>Workflows</Typography.Title>
        <Typography.Paragraph>
          Make your research reusable and reproducible. Create your
          containerized workflows, rerun whenever you want and save your
          results.
        </Typography.Paragraph>
      </Col>
      <Col span={4} offset={4}>
        <GithubOutlined />
        <GitlabOutlined />
      </Col>
    </Row>
  );
};

Integrations.propTypes = {};

export default Integrations;
