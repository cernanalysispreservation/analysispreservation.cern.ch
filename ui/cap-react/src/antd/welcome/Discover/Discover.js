import { Typography, Row, Col, Space } from "antd";

const Discover = () => {
  return (
    <Col
      xs={24}
      style={{
        background: "#fff",
        padding: "30px",
      }}
      id="discover"
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Typography.Title
          style={{ textAlign: "center", fontSize: "3rem" }}
          italic
        >
          Discover
        </Typography.Title>
        <Row justify="center" align="middle" style={{ textAlign: "center" }}>
          <Col xs={22} lg={18} xl={10} xxl={8}>
            <Space direction="vertical" size="large">
              <Typography.Paragraph italic style={{ fontSize: "1.1rem" }}>
                {`
                CERN Analysis Preservation (CAP) is a service for researchers to
                preserve and document the various components of their physics
                analyses, e.g. datasets, software, documentation, so that they
                are reusable and understandable in the future. By using this
                tool, researchers ensure these outputs are preserved, findable
                and accessible by their collaborators for the long-term.`}
              </Typography.Paragraph>

              <Typography.Paragraph italic style={{ fontSize: "1.1rem" }}>
                {`
                CAP uses existing collaboration tools and a flexible data model,
                and it is designed to be easily integrated into researchers'
                workflows. CAP provides standard collaboration access
                restrictions so that the individual users and collaborations are
                in full control of sharing their results.`}
              </Typography.Paragraph>
            </Space>
          </Col>
        </Row>
      </Space>
    </Col>
  );
};

Discover.propTypes = {};

export default Discover;
