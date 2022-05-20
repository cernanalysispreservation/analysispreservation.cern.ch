import React from "react";
import { Row, Col, Typography, Space, Card } from "antd";
import { GithubOutlined, GitlabOutlined } from "@ant-design/icons";
import ReanaIcon from "../img/reana.svg";
import PIDFair from "../img/pid_fair.svg";

const Integrations = () => {
  return (
    <Row justify="center" id="integrations" gutter={[32, 32]}>
      {/* <Col span={24} style={{ textAlign: "center" }}>
        <Typography.Title>Integrations</Typography.Title>
      </Col> */}

      <Col xs={22} md={12} lg={8}>
        <Card
          title="Source Code"
          style={{ height: "100%" }}
          // extra={
          //   <Space>
          //     <GithubOutlined />
          //     <GitlabOutlined />
          //   </Space>
          // }
        >
          <Typography.Paragraph>
            Attach code to your workspace. Connect your Github and CERN Gitlab
            accounts, follow repository changes and automatically keep snapshots
            of your work and of the tools/libraries you use.
          </Typography.Paragraph>
        </Card>
      </Col>

      <Col xs={22} md={12} lg={8}>
        <Card
          title=" Persistent Identifiers/FAIR data"
          style={{ height: "100%" }}
        >
          <Typography.Paragraph>
            Preserve your analysis in a FAIR manner (Findable Accesible
            Interoperable Reusable). Use persistent identifiers (PIDs) to
            capture and connect your analysis components. Make your work citable
            by pushing it to external services that provide PIDs.
          </Typography.Paragraph>
        </Card>
      </Col>
      {/* <Col span={12} style={{ textAlign: "right" }}>
        <PIDFair />
      </Col> */}

      <Col xs={22} md={12} lg={8}>
        <Card title="Workflows" style={{ height: "100%" }}>
          <Typography.Paragraph>
            Make your research reusable and reproducible. Create your
            containerized workflows, rerun whenever you want and save your
            results.
          </Typography.Paragraph>
        </Card>
      </Col>
      {/* <Col span={12} style={{ textAlign: "right" }}>
        <ReanaIcon size="large" />
      </Col> */}
    </Row>
  );
};

Integrations.propTypes = {};

export default Integrations;
