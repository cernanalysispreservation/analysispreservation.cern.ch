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
    <Row align="middle" justify="space-around" style={{ minHeight: "90vh" }}>
      {boxes.map(box => (
        <Col span={5} key={box.title} style={{ textAlign: "center" }}>
          <Space direction="vertical" size="large">
            {box.icon}
            <Typography.Title>{box.title}</Typography.Title>
            <Typography.Paragraph>{box.description}</Typography.Paragraph>
            {box.button}
          </Space>
        </Col>
      ))}
    </Row>
  );
};

Documentation.propTypes = {};

export default Documentation;
