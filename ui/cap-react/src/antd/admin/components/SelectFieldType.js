import React from "react";
import PropTypes from "prop-types";
import { Alert, Col, Divider, Row, Space, Tag, Typography } from "antd";
import fields from "../utils/fieldTypes";
import Draggable from "./Draggable";

const SelectFieldType = props => {
  return (
    <Row style={{ padding: "15px" }}>
      <Alert
        message="Informational Notes"
        description="Select the field type you want to use and drag and drop it to the
      desired location in the form"
        type="info"
        showIcon
        closable
      />
      <Space direction="vertical" size="large">
        {Object.entries(fields).map(([key, type]) => (
          <div key={key}>
            <Divider orientation="left">
              <Typography.Title level={5}>{type.title}</Typography.Title>
            </Divider>
            <Row gutter={[16, 8]}>
              {Object.entries(type.fields).map(([key, type], index) => (
                <Col xs={22} xl={12} key={key} style={{ width: "100%" }}>
                  <Draggable key={index} data={type}>
                    <Tag style={{ width: "100%" }} size="large">
                      <Space>
                        {type.icon}
                        {type.title}
                      </Space>
                    </Tag>
                  </Draggable>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Space>
    </Row>
  );
};

SelectFieldType.propTypes = {};

export default SelectFieldType;
