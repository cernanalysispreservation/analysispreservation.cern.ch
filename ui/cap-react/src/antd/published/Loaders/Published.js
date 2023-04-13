import { Col, Row, Skeleton, Space } from "antd";

const Published = () => {
  return (
    <Space direction="vertical" style={{ width: "100%", paddingTop: "10px" }}>
      <Row>
        <Col span={16}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Skeleton active title={false} paragraph={{ rows: 4 }} />
            <Skeleton active title={false} paragraph={{ rows: 4 }} />
            <Skeleton active title={false} paragraph={{ rows: 4 }} />
            <Skeleton active title={false} paragraph={{ rows: 4 }} />
            <Skeleton active title={false} paragraph={{ rows: 4 }} />
          </Space>
        </Col>
        <Col span={5}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Skeleton active title={false} />
            <Skeleton active title={false} />
            <Skeleton active title={false} />
          </Space>
        </Col>
      </Row>
    </Space>
  );
};

export default Published;
