import React from "react";
import PropTypes from "prop-types";
import { Row, Space, Tag } from "antd";
const SelectContentType = ({ contentTypes, select }) => {
  return (
    <Row>
      <Space style={{ width: "100%", flexWrap: "wrap" }}>
        {contentTypes &&
          contentTypes.map(item => (
            <Tag
              onClick={() => select(item.get("deposit_group"))}
              key={item.get("deposit_group")}
            >
              {item.get("name")}
            </Tag>
          ))}
      </Space>
    </Row>
  );
};

SelectContentType.propTypes = {};

export default SelectContentType;
