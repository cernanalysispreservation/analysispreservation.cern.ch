import axios from "axios";
import React, { useEffect, useState } from "react";
import DocumentTitle from "../partials/DocumentTitle";
import {
  Row,
  Col,
  Typography,
  Select,
  Button,
  Modal,
  notification,
  Tooltip,
} from "antd";
import {
  DiffOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import ErrorScreen from "../partials/Error";
import CodeEditor from "../utils/CodeEditor";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import CodeDiffViewer from "../utils/CodeDiffViewer";

const Schemas = ({ match }) => {
  const EDITABLE_FIELDS = [
    "fullname",
    "use_deposit_as_record",
    "deposit_mapping",
    "record_mapping",
    "deposit_options",
    "record_options",
    "config",
  ];

  const HIDDEN_FIELDS = ["links"];

  const FULL_SCHEMA = "Full schema";

  const { schema_name, schema_version } = match.params;

  const [originalSchema, setOriginalSchema] = useState();
  const [schema, setSchema] = useState();
  const [field, setField] = useState();
  const [selection, setSelection] = useState(FULL_SCHEMA);
  const [options, setOptions] = useState();
  const [showModal, setShowModal] = useState();
  const [jsonError, setJsonError] = useState();
  const [error, setError] = useState();

  const generateOptions = data => {
    const excludeRecordFields =
      "use_deposit_as_record" in data && data["use_deposit_as_record"] === true;
    let opts = Object.entries(data)
      .filter(
        e =>
          typeof e[1] === "object" &&
          e[1] !== null &&
          !Array.isArray(e[1]) &&
          !HIDDEN_FIELDS.includes(e[0]) &&
          (!excludeRecordFields || !e[0].startsWith("record_"))
      )
      .map(e => ({
        label: e[0],
        value: e[0],
      }));
    opts.unshift({ label: FULL_SCHEMA, value: "all" });
    return opts;
  };

  useEffect(() => {
    axios
      .get(`/api/jsonschemas/${schema_name}/${schema_version || ""}`)
      .then(res => {
        setOriginalSchema(res.data);
        setSchema(res.data);
        setField(res.data);
        setOptions(generateOptions(res.data));
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  const syncSchemaWithField = () => {
    if (selection !== FULL_SCHEMA) {
      const newSchema = { ...schema, [selection]: field };
      setSchema(newSchema);
      return newSchema;
    }
    return schema;
  };

  const handleSelectChange = (value, option) => {
    const newSchema = syncSchemaWithField();
    if (value === "all") {
      setField(newSchema);
    } else {
      setField(newSchema[value]);
    }
    setSelection(option.label);
    setJsonError(false);
  };

  const handleEdit = value => {
    try {
      setField(JSON.parse(value));
      setJsonError(false);
    } catch (error) {
      setJsonError(true);
    }
  };

  const handleSave = () => {
    let schemaToSave = field;
    if (selection != FULL_SCHEMA) {
      schemaToSave = { ...originalSchema, [selection]: field };
    }
    axios
      .put(`/api/jsonschemas/${schema_name}/${schema.version}`, schemaToSave)
      .then(() => {
        setOriginalSchema(schemaToSave);
        notification.success({
          message: "Schema updated",
          description: "Changes successfully applied",
        });
      })
      .catch(() =>
        notification.error({
          message: "Schema not updated",
          description: "Error while saving, please try again",
        })
      );
  };

  const handleRevert = () => {
    if (selection === FULL_SCHEMA) {
      setField(originalSchema);
      setSchema(originalSchema);
    } else {
      setField(originalSchema[selection]);
      setSchema({ ...schema, [selection]: originalSchema[selection] });
    }
  };

  return (
    <DocumentTitle title="Schemas">
      {error ? (
        <ErrorScreen />
      ) : (
        schema && (
          <React.Fragment>
            <Modal
              open={showModal}
              onCancel={() => setShowModal(false)}
              title={`${selection} diff`}
              width={1000}
              footer={null}
              bodyStyle={{
                overflowX: "scroll",
                overflowY: "auto",
                maxHeight: "calc(100vh - 200px)",
              }}
            >
              <CodeDiffViewer
                left={JSON.stringify(selection === FULL_SCHEMA
                  ? originalSchema
                  : originalSchema[selection], null, 2)
                }
                right={JSON.stringify(field, null, 2)}
              />
            </Modal>
            <Row justify="center">
              <Col xs={22} lg={14}>
                <Row
                  justify="space-between"
                  align="middle"
                  style={{ marginBottom: "1em" }}
                  gutter={10}
                >
                  <Col flex="auto">
                    <Typography.Title style={{ marginBottom: "0" }}>
                      {schema_name} ({schema.version})
                    </Typography.Title>
                  </Col>
                  <Col>
                    <Tooltip
                      placement="bottom"
                      title="Select a field to edit it (if it is editable). 
                  Check the diff, revert or save the changes to that field, 
                  or go back to 'Full schema' to check the full diff or to 
                  revert or save all changes at once."
                    >
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Col>
                  <Col xs={15} md={6}>
                    {schema && (
                      <Select
                        style={{
                          width: "100%",
                        }}
                        options={options}
                        onChange={handleSelectChange}
                        defaultValue="all"
                      />
                    )}
                  </Col>
                  <Col>
                    <Tooltip
                      placement="bottom"
                      title={
                        jsonError
                          ? "Please fix the syntax errors to be able to view the diff"
                          : selection === FULL_SCHEMA
                            ? "View the full diff"
                            : "View field diff"
                      }
                    >
                      <Button
                        icon={<DiffOutlined />}
                        onClick={() => setShowModal(true)}
                        disabled={jsonError}
                      />
                    </Tooltip>
                  </Col>
                  <Col>
                    <Tooltip
                      placement="bottom"
                      title={
                        selection === FULL_SCHEMA
                          ? "Revert all unsaved changes"
                          : "Revert unsaved changes to this field"
                      }
                    >
                      <Button icon={<UndoOutlined />} onClick={handleRevert} />
                    </Tooltip>
                  </Col>
                  <Col>
                    <Tooltip
                      placement="bottom"
                      title={
                        jsonError
                          ? "Please fix the syntax errors to be able to save changes"
                          : selection === FULL_SCHEMA
                            ? "Save all changes"
                            : !EDITABLE_FIELDS.includes(selection)
                              ? "Please select an editable field to be able to edit and save the changes"
                              : "Save changes to this field"
                      }
                    >
                      <Button
                        icon={<SaveOutlined />}
                        type="primary"
                        onClick={handleSave}
                        disabled={
                          jsonError ||
                          (selection != FULL_SCHEMA &&
                            !EDITABLE_FIELDS.includes(selection))
                        }
                      />
                    </Tooltip>
                  </Col>
                </Row>
                <Row justify="center">
                  <Col xs={24}>
                    <CodeEditor
                      value={JSON.stringify(
                        selection === FULL_SCHEMA ? schema : schema[selection],
                        null,
                        2
                      )}
                      lang={json}
                      isReadOnly={!EDITABLE_FIELDS.includes(selection)}
                      handleEdit={handleEdit}
                      lint={jsonParseLinter}
                      schema={schema} // to render a new editor instance on schema change
                      height="calc(100vh - 300px)"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </React.Fragment>
        )
      )}
    </DocumentTitle>
  );
};

export default Schemas;
