import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import ObjectFieldTemplate from "./templates/ObjectFieldTemplate";
import FieldTemplate from "./templates/Field/FieldTemplate";

import "./Form.less";
import { withTheme } from "@rjsf/core";
import { Theme as AntDTheme } from "@rjsf/antd";

const RJSFForm = props => {
  const Form = withTheme(AntDTheme);
  return (
    <Row className="__Form__" style={{ height: "95%", overflowX: "hidden" }}>
      <Col>
        <Form
          schema={props.schema}
          uiSchema={props.uiSchema}
          formData={props.formData}
          ObjectFieldTemplate={ObjectFieldTemplate}
          FieldTemplate={FieldTemplate}
          showErrorList={false}
          liveValidate
        >
          <span />
        </Form>
      </Col>
    </Row>
  );
};

RJSFForm.propTypes = {};

export default RJSFForm;
