import React from "react";
import PropTypes from "prop-types";
import HTML5Backend from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Col, Row, Spin } from "antd";
import PropertyEditor from "../containers/PropertyEditor";
import SelectFieldType from "../containers/SelectFieldType";
import SchemaPreview from "../containers/SchemaPreview";
import FormPreview from "../containers/FormPreview";

const SchemaWizard = ({ field, loader }) => {
  if (loader)
    return (
      <Row style={{ height: "100%" }} align="middle" justify="center">
        <Spin size="large" />;
      </Row>
    );
  return (
    <DndProvider backend={HTML5Backend}>
      <Row style={{ height: "100%" }}>
        <Col span={5} style={{ height: "100%" }}>
          {field ? <PropertyEditor /> : <SelectFieldType />}
        </Col>
        <Col span={5} style={{ overflowX: "hidden", height: "100%" }}>
          <Row justify="center">
            <SchemaPreview />
          </Row>
        </Col>
        <Col span={14} style={{ overflowX: "hidden", height: "100%" }}>
          <FormPreview />
        </Col>
      </Row>
    </DndProvider>
  );
};

SchemaWizard.propTypes = {};

export default SchemaWizard;
