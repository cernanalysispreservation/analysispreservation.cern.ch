import React from "react";
import HomeImage from "../img/home-image.svg";
import { Row, Col, Typography, Space, Card } from "antd";
import {
  DatabaseOutlined,
  TeamOutlined,
  ReloadOutlined
} from "@ant-design/icons";

const Intro = () => {
  const boxes = [
    {
      title: "Capture",
      icon: <DatabaseOutlined style={{ fontSize: "2em" }} />,
      description:
        "Preserve elements needed to understand and rerun your analysis"
    },
    {
      title: "Collaborate",
      icon: <TeamOutlined style={{ fontSize: "2em" }} />,
      description:
        "Share your analysis with other users, your collaboration or group"
    },
    {
      title: "Reuse",
      icon: <ReloadOutlined style={{ fontSize: "2em" }} />,
      description:
        "Run containerized workflows and easily reuse analysis components"
    }
  ];
  return (
    <Col xs={22} lg={20} xxl={16}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Row
          justify="center"
          align="middle"
          id="home"
          style={{ minHeight: "30vh" }}
        >
          <Space>
            <HomeImage />
            <Space direction="vertical" size={0}>
              <Typography.Title level={1}>
                CERN Analysis Preservation
              </Typography.Title>
              <Typography.Text italic style={{ fontSize: "1.1rem" }}>
                capture, preserve and reuse physics analyses
              </Typography.Text>
            </Space>
          </Space>
        </Row>
        <Row justify="center" gutter={[32, 32]} style={{ minHeight: "20vh" }}>
          {boxes.map(item => (
            <Col key={item.title} style={{ textAlign: "center" }}>
              <Space direction="vertical" size="middle">
                <Card title={item.title}>
                  <Space direction="vertical" size="large">
                    {item.icon}
                    <Typography.Paragraph style={{ fontSize: "1.1rem" }}>
                      {item.description}
                    </Typography.Paragraph>
                  </Space>
                </Card>
              </Space>
            </Col>
          ))}
        </Row>
      </Space>
    </Col>
  );
};

Intro.propTypes = {};

export default Intro;
