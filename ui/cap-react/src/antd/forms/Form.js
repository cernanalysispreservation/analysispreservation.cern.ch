import React from "react";
import PropTypes from "prop-types";
// import { withTheme } from "@rjsf/core";
// import { Theme as AntDTheme } from "@rjsf/antd";
import { Row, Col } from "antd";
// import Form from "@rjsf/antd";
// import ObjectFieldTemplate from "../../components/drafts/form/themes/grommet/templates/ObjectFieldTemplate";
import ObjectFieldTemplate from "../forms/templates/ObjectFieldTemplate";
import FieldTemplate from "../../components/drafts/form/themes/grommet/templates/FieldTemplate";
import "./Form.less";
import { withTheme } from "@rjsf/core";
import { Theme as AntDTheme } from "@rjsf/antd";

const RJSFForm = props => {
  const Form = withTheme(AntDTheme);
  return (
    <Row className="__Form__" style={{ height: "100%" }}>
      <Col>
        <Form
          schema={props.schema}
          uiSchema={props.uiSchema}
          formData={props.formData}
          ObjectFieldTemplate={ObjectFieldTemplate}
          FieldTemplate={FieldTemplate}
          liveValidate
          showErrorList={false}
        >
          <span />
        </Form>
      </Col>
    </Row>
  );
};

RJSFForm.propTypes = {};

export default RJSFForm;
