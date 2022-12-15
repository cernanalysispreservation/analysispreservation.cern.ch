import React from "react";
import PropTypes from "prop-types";
import Form from "../../forms/Form";
import { transformSchema } from "../../partials/Utils/schema";
import { shoudDisplayGuideLinePopUp } from "../utils";
import { Row, Empty, Space, Typography } from "antd";

const FormPreview = ({ schema, uiSchema }) => {
  if (shoudDisplayGuideLinePopUp(schema))
    return (
      <Row justify="center" align="middle" style={{ height: "100%" }}>
        <Empty
          description={
            <Space direction="vertical">
              <Typography.Title level={5}>Your form is empty</Typography.Title>
              <Typography.Text type="secondary">
                Add fields to the drop area to initialize your form
              </Typography.Text>
            </Space>
          }
        />
      </Row>
    );
  return (
    <Form
      schema={transformSchema(schema.toJS())}
      uiSchema={uiSchema.toJS()}
      formData={{}}
      onChange={() => {}}
    />
  );
};

FormPreview.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
};

export default FormPreview;
