import { Row, Col, Typography, Button, Card, Space } from "antd";
import { CodeOutlined, CodepenOutlined, ReadOutlined } from "@ant-design/icons";

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
      icon: <ReadOutlined style={{ fontSize: "3em" }} />,
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
      ),
    },
    {
      title: "RESTful API",
      description:
        "Try using our RESTful interface, to integrate CAP with your daily tools and services using HTTP requests.",
      icon: <CodepenOutlined style={{ fontSize: "3em" }} />,
      button: (
        <Button type="primary" href="/docs/api" target="_blank">
          API Guides & Docs
        </Button>
      ),
    },
  ];
  return (
    <Col xs={24} style={{ margin: "30px" }} id="documentation">
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Typography.Title
          style={{ textAlign: "center", fontSize: "3rem" }}
          italic
        >
          Documentation
        </Typography.Title>
        <Row gutter={[64, 64]} justify="center">
          {boxes.map(item => (
            <Col key={item.title} xs={22} sm={10} lg={7} xl={6} xxl={4}>
              <Card style={{ height: "100%" }}>
                <Space
                  direction="vertical"
                  style={{ width: "100%", textAlign: "center" }}
                  size="large"
                >
                  {item.icon}
                  <Typography.Title level={3} style={{ textAlign: "center" }}>
                    {item.title}
                  </Typography.Title>
                  <Typography.Paragraph
                    style={{ fontSize: "1.1rem", textAlign: "center" }}
                  >
                    {item.description}
                  </Typography.Paragraph>
                  {item.button}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </Col>
  );
};

export default Documentation;
