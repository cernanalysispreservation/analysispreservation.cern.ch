import PropTypes from "prop-types";
import { Button, Col, Row, Typography } from "antd";
import SchemaTree from "../containers/SchemaTree";
import { SettingOutlined } from "@ant-design/icons";

const SchemaPreview = ({ schema, selectProperty }) => {
  return (
    <div style={{ height: "80%" }}>
      <Row justify="center">
        <Col span={24}>
          <Typography.Title
            level={4}
            style={{ textAlign: "center", margin: "15px 0" }}
          >
            Schema tree
          </Typography.Title>
        </Col>
      </Row>
      <Row
        wrap={false}
        justify="space-between"
        align="middle"
        style={{ padding: "0 10px" }}
      >
        <Typography.Title level={5} style={{ margin: 0 }} ellipsis>
          {(schema && schema.get("title")) || "root"}
        </Typography.Title>
        <Button
          type="link"
          shape="circle"
          icon={<SettingOutlined />}
          onClick={() => selectProperty({ schema: [], uiSchema: [] })}
        />
      </Row>
      <Row style={{ padding: "0 10px" }}>
        <Typography.Text type="secondary" level={5}>
          {schema && schema.get("description")}
        </Typography.Text>
      </Row>
      <SchemaTree key="schemaTree" />
    </div>
  );
};

SchemaPreview.propTypes = {
  schema: PropTypes.object,
  selectProperty: PropTypes.func,
};

export default SchemaPreview;
