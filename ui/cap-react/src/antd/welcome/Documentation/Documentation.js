import React from "react";
import { Row, Col, Typography, Button, Space, Card } from "antd";
import {
  WalletOutlined,
  CodeOutlined,
  BranchesOutlined
} from "@ant-design/icons";

const Documentation = () => {
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
    <Row id="documentation" gutter={[32, 32]} justify="space-around">
      {boxes.map(item => (
        <Col key={item.title} xs={22} md={12} xl={8}>
          <Card
            title={item.title}
            extra={[item.button]}
            style={{ height: "100%" }}
          >
            <Typography.Paragraph>{item.description}</Typography.Paragraph>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default Documentation;
