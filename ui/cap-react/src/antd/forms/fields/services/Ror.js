import React from "react";
import PropTypes from "prop-types";
import { Space, Tag, Typography } from "antd";

const Ror = ({ data }) => {
  return (
    <Space direction="vertical">
      <Typography.Title level={5} style={{ margin: 0 }}>
        {data.name}
      </Typography.Title>
      <Space>
        <Typography.Text>
          {data.acronyms && data.acronyms.length > 0 ? `${data.acronyms},` : ""}
          {data.country.country_code}
        </Typography.Text>
        <Typography.Text>{data.country.country_name}</Typography.Text>
      </Space>
      <Space>
        <Tag color="blue">{data.types}</Tag>
        <a href={data.links}>{data.links}</a>
      </Space>
    </Space>
  );
};

Ror.propTypes = {
  data: PropTypes.object,
};

export default Ror;
