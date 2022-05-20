import React from "react";
import Intro from "./Intro";
import Discover from "./Discover";
import Explain from "./Explain";
import Integrations from "./Integrations";
import Documentation from "./Documentation";
import Contact from "./Contact";
import { Col, Row, Space, Typography } from "antd";

const index = () => {
  return (
    <Row justify="center">
      <Col xs={22} lg={20} xl={18} xxl={16} style={{ background: "l" }}>
        <Space direction="vertical" size="large">
          <Intro />
          <Discover />
          <Typography.Title style={{ textAlign: "center" }}>
            Start Preserving
          </Typography.Title>
          <Explain />
          <Typography.Title style={{ textAlign: "center" }}>
            Integrations
          </Typography.Title>
          <Integrations />
          <Typography.Title style={{ textAlign: "center" }}>
            Documentation
          </Typography.Title>
          <Documentation />
          <Contact />
        </Space>
      </Col>
    </Row>
  );
};

export default index;
