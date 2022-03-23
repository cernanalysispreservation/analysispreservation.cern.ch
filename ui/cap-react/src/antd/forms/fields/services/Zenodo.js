import React from "react";
import PropTypes from "prop-types";
import { Space, Typography } from "antd";

const Zenodo = ({ data }) => {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space>
        <Typography.Text>ID</Typography.Text>
        <Space>
          <Typography.Text>{data.id}</Typography.Text>
        </Space>
      </Space>
      <Space>
        <Typography.Text>Title</Typography.Text>
        <Typography.Text>{data.metadata.title}</Typography.Text>
      </Space>
      <Space>
        <Typography.Text>DOI</Typography.Text>
        <Typography.Text>{data.metadata.doi}</Typography.Text>
      </Space>
      <Space>
        <Typography.Text>URL</Typography.Text>
        <a href={data.links.self}>{data.links.self}</a>
      </Space>
    </Space>
  );
};

Zenodo.propTypes = {
  data: PropTypes.object
};

export default Zenodo;
