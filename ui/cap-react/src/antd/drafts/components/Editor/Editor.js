import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Col, Radio, Row, Space, Typography } from "antd";
import Error from "../../../partials/Error/";
import { transformSchema } from "../../utils/transformSchema";
import { canEdit } from "../../utils/permissions";

import Form from "../../../forms";
import { SaveOutlined } from "@ant-design/icons";
const Editor = ({
  schemaErrors,
  schemas = { schema: {}, uiSchema: {} },
  formData,
  match,
  initForm,
  fetchSchemaByNameVersion,
  canAdmin,
  canUpdate
}) => {
  useEffect(() => {
    if (match.params.schema_id) {
      initForm();
      fetchSchemaByNameVersion(match.params.schema_id);
    }
  }, []);
  if (!schemas) return null;
  if (schemaErrors.length > 0) {
    return <Error error={schemaErrors[0]} />;
  }
  let _schema =
    schemas && schemas.schema ? transformSchema(schemas.schema) : null;

  return (
    <Col span={24} style={{ height: "100%", overflow: "auto" }}>
      {canEdit(canAdmin, canUpdate) && (
        <Row
          justify="space-between"
          style={{
            padding: "10px",
            background: "#fff"
          }}
        >
          <Radio.Group defaultValue="edit" buttonStyle="solid">
            <Radio.Button value="edit">Edit</Radio.Button>
            <Radio.Button value="preview">Preview</Radio.Button>
          </Radio.Group>
          <Button icon={<SaveOutlined />} type="primary">
            Save
          </Button>
        </Row>
      )}
      <Form
        formData={formData || {}}
        schema={_schema}
        uiSchema={schemas.uiSchema || {}}
      />
    </Col>
  );
};

Editor.propTypes = {};

export default Editor;
