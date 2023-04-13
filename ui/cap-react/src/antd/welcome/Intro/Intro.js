import { ReactComponent as HomeImage } from "../img/home-image.svg";
import { Row, Col, Typography, Space } from "antd";
import {
  DatabaseOutlined,
  TeamOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const Intro = () => {
  const boxes = [
    {
      title: "Capture",
      icon: <DatabaseOutlined style={{ fontSize: "2em" }} />,
      description:
        "Preserve elements needed to understand and rerun your analysis",
    },
    {
      title: "Collaborate",
      icon: <TeamOutlined style={{ fontSize: "2em" }} />,
      description:
        "Share your analysis with other users, your collaboration or group",
    },
    {
      title: "Reuse",
      icon: <ReloadOutlined style={{ fontSize: "2em" }} />,
      description:
        "Run containerized workflows and easily reuse analysis components",
    },
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
          <Space size="large">
            <Space direction="vertical" size={0}>
              <Typography.Title level={1}>
                CERN <br /> Analysis Preservation
              </Typography.Title>
              <Typography.Text italic style={{ fontSize: "1.1rem" }}>
                capture, preserve and reuse physics analyses
              </Typography.Text>
            </Space>
            <HomeImage />
          </Space>
        </Row>
        <Row justify="center" gutter={[32, 32]} style={{ minHeight: "20vh" }}>
          {boxes.map(item => (
            <Col key={item.title} style={{ textAlign: "center" }}>
              <Space direction="vertical" size="middle">
                <Space direction="vertical" size="large">
                  {item.icon}
                  <Typography.Title level={3}>{item.title}</Typography.Title>
                  <Typography.Paragraph style={{ fontSize: "1.1rem" }}>
                    {item.description}
                  </Typography.Paragraph>
                </Space>
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
