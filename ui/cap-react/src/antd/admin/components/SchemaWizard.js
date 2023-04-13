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
        <Col
          xs={10}
          sm={5}
          style={{
            overflowX: "hidden",
            height: "100%",
            display: "flex",
          }}
        >
          {field ? <PropertyEditor /> : <SelectFieldType />}
        </Col>
        <Col
          xs={14}
          sm={5}
          style={{
            overflowX: "hidden",
            height: "100%",
            padding: "0px 15px",
            backgroundColor: "#F6F7F8",
          }}
        >
          <SchemaPreview />
        </Col>
        <Col
          xs={24}
          sm={14}
          style={{ overflowX: "hidden", height: "100%", padding: "0px 15px" }}
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
