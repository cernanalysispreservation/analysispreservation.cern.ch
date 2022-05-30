import React from "react";
import { Row, Col, Typography, Button, Card, Space } from "antd";
import {
  WalletOutlined,
  CodeOutlined,
  BranchesOutlined,
  CodepenOutlined,
  ReadOutlined
} from "@ant-design/icons";

const Documentation = () => {
  const boxes = [
    {
      title: "User Guide",
      description:
        "Find out how you can use the CAP service to capture, preserve and reuse your analysis through user guides and stories",
      button: (
        <Button
          type="primary"
          href="/docs/general/"
          target="_blank"
          icon={<ReadOutlined />}
        >
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
        <Button
          type="primary"
          href="/docs/cli/"
          target="_blank"
          icon={<CodeOutlined />}
        >
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
        <Button
          type="primary"
          href="/docs/api"
          target="_blank"
          icon={<CodepenOutlined />}
        >
          API Guides & Docs
        </Button>
      )
    }
  ];
  return (
    <Col xs={24} style={{ margin: "2rem 0" }}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Typography.Title
          style={{ textAlign: "center", fontSize: "3rem" }}
          italic
        >
          Documentation
        </Typography.Title>
        <Row id="documentation" gutter={[64, 64]} justify="center">
          {boxes.map(item => (
            <Col key={item.title} xs={22} sm={18} lg={14} xl={10} xxl={5}>
              <Card
                title={item.title}
                extra={[item.button]}
                style={{ height: "100%" }}
              >
                <Typography.Paragraph style={{ fontSize: "1.1rem" }}>
                  {item.description}
                </Typography.Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </Col>
  );
};

export default Documentation;
