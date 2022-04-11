import React from "react";
import { Row, Col, Space, Typography, Button } from "antd";
import {
  MailOutlined,
  TwitterOutlined,
  GithubOutlined
} from "@ant-design/icons";

import AliceIcon from "../img/alice.svg";
import AtlasIcon from "../img/atlas.svg";
import CmsIcon from "../img/cms.svg";
import LHCbLogo from "../img/lhcb-logo.svg";

const Contact = () => {
  return (
    <Row justify="center">
      <Col xs={6}>
        <Space direction="vertical">
          <Button
            type="link"
            href="mailto:analysis-preservation-support@cern.ch"
            icon={<MailOutlined />}
            size="large"
          >
            analysis-preservation-support@cern.ch
          </Button>
          <Button
            type="link"
            href="https://twitter.com/analysispreserv"
            target="_blank"
            icon={<TwitterOutlined />}
            size="large"
          >
            @analysispreserv
          </Button>
          <Button
            type="link"
            href="https://github.com/cernanalysispreservation/analysispreservation.cern.ch"
            target="_blank"
            icon={<GithubOutlined />}
            size="large"
          >
            @cernanalysispreservation
          </Button>
        </Space>
      </Col>
      <Col xs={24} lg={6} style={{ textAlign: "center" }}>
        <Typography.Title level={4}>Supported by:</Typography.Title>
        <Row justify="center">
          <Space direction="vertical">
            <Space>
              <AliceIcon size="medium" />
              <AtlasIcon size="medium" />
            </Space>
            <Space>
              <CmsIcon size="medium" />
              <LHCbLogo height="40px" />
            </Space>
          </Space>
        </Row>
      </Col>
    </Row>
  );
};

export default Contact;
