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
      <Row style={{ height: "100%" }} gutter={[16, 16]}>
        <Col span={5} style={{ overflowX: "hidden", height: "100%" }}>
          {field ? <PropertyEditor /> : <SelectFieldType />}
        </Col>
        <Col
          span={5}
          style={{ overflowX: "hidden", height: "100%", padding: "15px" }}
        >
          <SchemaPreview />
        </Col>
        <Col
          span={14}
          style={{
            overflowX: "hidden",
            height: "100%",
            padding: "15px",
            borderLeft: "1px dotted lightgray",
          }}
        >
          <FormPreview />
        </Col>
      </Row>
    </DndProvider>
  );
};

SchemaWizard.propTypes = {
  loader: PropTypes.bool,
  field: PropTypes.object,
};

export default SchemaWizard;
