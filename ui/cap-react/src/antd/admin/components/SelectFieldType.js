import React from "react";
import { Col, Divider, Row, Space, Typography } from "antd";
import fields from "../utils/fieldTypes";
import Draggable from "./Draggable";

const SelectFieldType = () => {
  return (
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
                  <div
                    style={{ width: "100%", padding: "2px 5px" }}
                  >
                    <Space>
                      {type.icon}
                      {type.title}
                    </Space>
                  </div>
                </Draggable>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Space>
  );
};

SelectFieldType.propTypes = {};

export default SelectFieldType;
