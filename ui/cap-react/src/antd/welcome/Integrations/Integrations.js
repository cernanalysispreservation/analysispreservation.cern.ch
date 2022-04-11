import React from "react";
import { Row, Col, Typography, Space } from "antd";
import { GithubOutlined, GitlabOutlined } from "@ant-design/icons";
import ReanaIcon from "../img/reana.svg";
import PIDFair from "../img/pid_fair.svg";

const Integrations = () => {
  return (
    <Row justify="center" id="integrations">
      <Col span={24} style={{ textAlign: "center" }}>
        <Typography.Title>Integrations</Typography.Title>
      </Col>

      <Col span={6}>
        <Typography.Title level={3}>Source Code</Typography.Title>
        <Typography.Paragraph>
          Attach code to your workspace. Connect your Github and CERN Gitlab
          accounts, follow repository changes and automatically keep snapshots
          of your work and of the tools/libraries you use.
        </Typography.Paragraph>
      </Col>
      <Col span={6} style={{ textAlign: "right", fontSize: "30px" }}>
        <Space>
          <GithubOutlined />
          <GitlabOutlined />
        </Space>
      </Col>
      <Col span={24} />
      <Col span={6}>
        <Typography.Title level={3}>
          Persistent Identifiers/FAIR data
        </Typography.Title>
        <Typography.Paragraph>
          Preserve your analysis in a FAIR manner (Findable Accesible
          Interoperable Reusable). Use persistent identifiers (PIDs) to capture
          and connect your analysis components. Make your work citable by
          pushing it to external services that provide PIDs.
        </Typography.Paragraph>
      </Col>
      <Col span={6} style={{ textAlign: "right" }}>
        <PIDFair />
      </Col>
      <Col span={24} />
      <Col span={6}>
        <Typography.Title level={3}>Workflows</Typography.Title>
        <Typography.Paragraph>
          Make your research reusable and reproducible. Create your
          containerized workflows, rerun whenever you want and save your
          results.
        </Typography.Paragraph>
      </Col>
      <Col span={6} style={{ textAlign: "right" }}>
        <ReanaIcon size="large" />
      </Col>
    </Row>
  );
};

Integrations.propTypes = {};

export default Integrations;
