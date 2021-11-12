import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Typography, Button, Space } from "antd";
import {
  WalletOutlined,
  CodeOutlined,
  BranchesOutlined
} from "@ant-design/icons";

const Documentation = props => {
  const boxes = [
    {
      title: "User Guide",
      description:
        "Find out how you can use the CAP service to capture, preserve and reuse your analysis through user guides and stories",
      button: (
        <Button type="primary" href="/docs/general/" target="_blank">
          General Docs
        </Button>
      ),
      icon: <WalletOutlined style={{ fontSize: "3em" }} />
    },
    {
      title: "CLI Client",
      description:
        "Learn how to interact with your analysis workspace via the command line interface, to make the preservation process part of your everyday work.",
      icon: <CodeOutlined style={{ fontSize: "3em" }} />,
      button: (
        <Button type="primary" href="/docs/cli/" target="_blank">
          CAP-client Guide
        </Button>
      )
    },
    {
      title: "RESTful API",
      description:
        "Try using our RESTful interface, to integrate CAP with your daily tools and services using HTTP requests.",
      icon: <BranchesOutlined style={{ fontSize: "3em" }} />,
      button: (
        <Button type="primary" href="/docs/api" target="_blank">
          API Guides & Docs
        </Button>
      )
    }
  ];
  return (
    <Row
      justify="center"
      style={{ textAlign: "center", minHeight: "50vh" }}
      align="middle"
      id="documentation"
    >
      <Space direction="vertical" size="large">
        <Col span={24}>
          <Typography.Title level={1}>Documentation</Typography.Title>
        </Col>
        <Row gutter={6}>
          {boxes.map(item => (
            <Col
              key={item.title}
              lg={{ span: 4, offset: 3 }}
              md={{ span: 8 }}
              xs={{ span: 16, offset: 4 }}
              sm={{ span: 18, offset: 3 }}
              style={{
                background: "white",
                textAlign: "center",
                padding: "25px 10px"
              }}
            >
              <Space direction="vertical" size="large">
                {item.icon}
                <Typography.Title level={3}>{item.title}</Typography.Title>
                <Typography.Text level={3}>{item.description}</Typography.Text>
                {item.button}
              </Space>
            </Col>
          ))}
        </Row>
      </Space>
    </Row>
  );
};

Documentation.propTypes = {};

export default Documentation;
