import { Col, Collapse, Row, Space, Typography } from "antd";
import fields from "../utils/fieldTypes";
import Draggable from "./Draggable";

const SelectFieldType = () => {
  return (
    <div style={{ width: "100%", padding: "0px 15px" }}>
      <Typography.Title
        level={4}
        style={{ textAlign: "center", margin: "15px 0" }}
      >
        Field types
      </Typography.Title>
      <Collapse defaultActiveKey={["simple", "collections"]} ghost>
        {Object.entries(fields).map(([key, type]) => (
          <Collapse.Panel key={key} header={type.title}>
            <Row gutter={[16, 8]}>
              {Object.entries(type.fields).map(([key, type], index) => (
                <Col xs={22} xl={12} key={key} style={{ width: "100%" }}>
                  <Draggable key={index} data={type}>
                    <Space style={{ padding: "2px 5px" }}>
                      {type.icon}
                      {type.title}
                    </Space>
                  </Draggable>
                </Col>
              ))}
            </Row>
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
};

SelectFieldType.propTypes = {};

export default SelectFieldType;
