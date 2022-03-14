import React from "react";
import { Card, Col, Row } from "antd";
import CreateForm from "../containers/CreateForm";
import DropZoneForm from "../containers/DropZoneForm";
import SelectContentType from "../containers/SelectContentType";

const AdminIndex = () => {
  return (
    <Row justify="center" style={{ height: "100%" }} align="middle">
      <Col xs={22} lg={16}>
        <Card title="Create your form dynamically">
          <Row gutter={[32, 32]}>
            <Col xs={22} md={12} xl={8}>
              <Card title="Create your own schema">
                <CreateForm />
              </Card>
            </Col>
            <Col xs={22} md={12} xl={8}>
              <Card title="Import your own JSON">
                <DropZoneForm />
              </Card>
            </Col>
            <Col xs={22} md={24} xl={8}>
              <Card title="Select a pre-defined schema">
                <SelectContentType />
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default AdminIndex;
