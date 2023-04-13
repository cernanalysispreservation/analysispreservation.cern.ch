import { useState } from "react";
import PropTypes from "prop-types";
import { Col, Layout } from "antd";
import Error from "../../../partials/Error/";
import { transformSchema } from "../../utils/transformSchema";
import Header from "../../containers/EditorHeader";
import Form from "../../../forms";
import { canEdit } from "../../utils/permissions";

const Editor = ({
  schemaErrors,
  schemas = { schema: {}, uiSchema: {} },
  formData,
  formDataChange,
  extraErrors,
  formRef,
  history,
  canAdmin,
  canUpdate,
}) => {
  const [mode, setMode] = useState(
    (history.location.state && history.location.state.mode) || "edit"
  );
  if (!schemas) return null;
  if (schemaErrors.length > 0) {
    return <Error error={schemaErrors[0]} />;
  }
  let _schema =
    schemas && schemas.schema ? transformSchema(schemas.schema) : null;

  const _formDataChange = change => formDataChange(change.formData);
  return (
    <Col span={24} style={{ height: "100%", overflow: "auto" }}>
      <Layout style={{ height: "100%", padding: 0 }}>
        <Header formRef={formRef} mode={mode} updateMode={setMode} />
        <Layout.Content style={{ height: "100%", overflowX: "hidden" }}>
          <Form
            formData={formData || {}}
            formRef={formRef}
            schema={_schema}
            uiSchema={schemas.uiSchema || {}}
            onChange={_formDataChange}
            extraErrors={extraErrors || {}}
            draftEditor
            readonly={mode != "edit" || !canEdit(canAdmin, canUpdate)}
          />
        </Layout.Content>
      </Layout>
    </Col>
  );
};

Editor.propTypes = {
  schemaErrors: PropTypes.array,
  schemas: PropTypes.object,
  formData: PropTypes.object,
  currentUser: PropTypes.object,
  match: PropTypes.object,
  initForm: PropTypes.func,
  fetchSchemaByNameVersion: PropTypes.func,
  formDataChange: PropTypes.func,
  extraErrors: PropTypes.object,
  formRef: PropTypes.object,
  history: PropTypes.object,
  canAdmin: PropTypes.bool,
  canUpdate: PropTypes.bool,
};

export default Editor;
