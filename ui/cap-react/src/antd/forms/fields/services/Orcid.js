import React from "react";
import PropTypes from "prop-types";
import { Space, Typography } from "antd";

const Orcid = ({ data }) => {
  return (
    <Space direction="vertical">
      <Space>
        <Typography.Text>ID</Typography.Text>
        <Typography.Text>{data["orcid-identifier"].path}</Typography.Text>
      </Space>
      <Space>
        <Typography.Text>Name</Typography.Text>
        <Typography.Text>
          {data.person.name["family-name"].value}{" "}
          {data.person.name["given-names"].value}
        </Typography.Text>
      </Space>
      <Space>
        <Typography.Text>URL</Typography.Text>
        <a href={data["orcid-identifier"].uri}>
          {data["orcid-identifier"].uri}
        </a>
      </Space>
    </Space>
  );
};

Orcid.propTypes = {};

export default Orcid;
