import React from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";

const DropArea = () => (
  <Space
    style={{
      border: "1px solid lightgrey",
      color: "grey",
      width: "100%",
      padding: "4px",
      justifyContent: "center",
      margin: "1px 0",
    }}
  >
    <Typography.Text style={{ color: "grey" }}>Drop items here</Typography.Text>
    <DownloadOutlined />
  </Space>
);

export default DropArea;
