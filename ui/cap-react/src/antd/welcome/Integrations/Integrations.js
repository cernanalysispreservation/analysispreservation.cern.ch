import React from "react";
import { Row, Col, Typography, Space } from "antd";
import { GithubOutlined, GitlabOutlined } from "@ant-design/icons";
import ReanaIcon from "../img/reana.svg";
import PIDFair from "../img/pid_fair.svg";

const Integrations = () => {
  return (
    <Col
      xs={24}
      style={{
        margin: "2rem 0",
        background: "#fff",
        padding: "1rem"
      }}
      id="integrations"
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography.Title
          style={{ textAlign: "center", fontSize: "3rem" }}
          italic
        >
          Integrations
        </Typography.Title>
        <Row justify="center">
          <Col xs={22} sm={15} style={{ margin: "2rem 0", padding: "1rem" }}>
            <Row align="space-between">
              <Col xs={24} md={12}>
                <Space direction="vertical">
                  <Typography.Title italic level={3} >
                    Source Code
                  </Typography.Title>
                  <Typography.Paragraph
                    style={{ fontSize: "1.1rem" }}
                  >
                    Attach code to your workspace. Connect your Github and CERN
                    Gitlab accounts, follow repository changes and automatically
                    keep snapshots of your work and of the tools/libraries you
                    use.
                  </Typography.Paragraph>
                </Space>
              </Col>

              <Space>
                <GithubOutlined style={{ fontSize: "2.5rem" }} />
                <GitlabOutlined style={{ fontSize: "2.5rem" }} />
              </Space>
            </Row>
          </Col>

          <Col
            xs={22}
            sm={15}
            style={{
              margin: "2rem 0",
              padding: "1rem",
              boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px"
            }}
          >
            <Row align="space-between">
              <PIDFair />
              <Col xs={24} md={12}>
                <Space direction="vertical">
                  <Typography.Title italic level={3} >
                    Persistent Identifiers/FAIR data
                  </Typography.Title>
                  <Typography.Paragraph
                    style={{ fontSize: "1.1rem" }}
                  >
                    Preserve your analysis in a FAIR manner (Findable Accesible
                    Interoperable Reusable). Use persistent identifiers (PIDs)
                    to capture and connect your analysis components. Make your
                    work citable by pushing it to external services that provide
                    PIDs.
                  </Typography.Paragraph>
                </Space>
              </Col>
            </Row>
          </Col>
          <Col xs={22} sm={15} style={{ margin: "2rem 0", padding: "1rem" }}>
            <Row align="space-between">
              <Col xs={24} md={12}>
                <Space direction="vertical">
                  <Typography.Title italic level={3} >
                    Workflows
                  </Typography.Title>
                  <Typography.Paragraph
                    style={{ fontSize: "1.1rem"  }}
                  >
                    Make your research reusable and reproducible. Create your
                    containerized workflows, rerun whenever you want and save
                    your results.
                  </Typography.Paragraph>
                </Space>
              </Col>

              <ReanaIcon />
            </Row>
          </Col>
        </Row>
      </Space>
    </Col>
  );
};

Integrations.propTypes = {};

export default Integrations;
