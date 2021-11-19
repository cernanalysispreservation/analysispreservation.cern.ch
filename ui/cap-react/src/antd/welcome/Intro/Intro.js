import React from "react";
import PropTypes from "prop-types";
import HomeImage from "../../../components/welcome/img/home-image.svg";
import { Row, Col, Typography, Space } from "antd";
import {
  DatabaseOutlined,
  TeamOutlined,
  ReloadOutlined
} from "@ant-design/icons";
const Intro = props => {
  const boxes = [
    {
      title: "Capture",
      icon: <DatabaseOutlined style={{ fontSize: "2em" }} />,
      description:
        "Collect and preserve elements needed to understand and rerun your analysis"
    },
    {
      title: "Collaborate",
      icon: <TeamOutlined style={{ fontSize: "2em" }} />,
      description:
        "Share your analysis and components with other users, your collaboration or group"
    },
    {
      title: "Reuse",
      icon: <ReloadOutlined style={{ fontSize: "2em" }} />,
      description:
        "Run containerized workflows and easily reuse analysis components"
    }
  ];
  return (
    <Row justify="center" align="middle" style={{ height: "90vh" }}>
      <Col span={6}>
        <Typography.Title level={1}>CERN</Typography.Title>
        <Typography.Title level={2}>Analysis Preservation</Typography.Title>
        <Typography.Text>
          capture, preserve and reuse physics analyses
        </Typography.Text>
      </Col>
      <Col span={8}>
        <HomeImage />
      </Col>
      <Row>
        {boxes.map(item => (
          <Col
            span={4}
            offset={3}
            key={item.title}
            style={{ textAlign: "center" }}
          >
            <Space direction="vertical" size="middle">
              <Typography.Title level={3}>{item.title}</Typography.Title>
              {item.icon}
              <Typography.Paragraph>{item.description}</Typography.Paragraph>
            </Space>
          </Col>
        ))}
      </Row>
    </Row>
  );
};

Intro.propTypes = {};

export default Intro;
