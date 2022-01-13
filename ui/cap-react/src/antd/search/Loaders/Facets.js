import React from "react";
import { Row, Space, Skeleton } from "antd";

const Facets = () => {
  return (
    <Space style={{ width: "100%" }} direction="vertical" size="large">
      <Row
        justify="space-between"
        style={{ background: "#fff", padding: "15px" }}
      >
        <Space direction="vertical">
          <Skeleton.Input style={{ width: 100 }} active />
          <Skeleton.Button active size="small" shape="round" />
        </Space>
        <Space direction="vertical">
          <Skeleton.Input style={{ width: 100 }} active />
          <Skeleton.Button active size="small" shape="round" />
        </Space>
      </Row>
      <div style={{ background: "#fff", padding: "15px" }}>
        {[...Array(10)].map(item => (
          <Row
            justify="space-between"
            key={item}
            style={{ marginBottom: "10px" }}
          >
            <Space>
              <Skeleton.Avatar size="small" active />
              <Skeleton.Input style={{ width: 100 }} active />
            </Space>
            <Skeleton.Button active size="small" shape="round" />
          </Row>
        ))}
      </div>
    </Space>
  );
};

export default Facets;
