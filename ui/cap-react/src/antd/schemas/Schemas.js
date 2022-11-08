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
import JsonDiff from "../../components/cms/components/SchemaWizard/JSONDiff";
import {
  DiffOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import JSONInput from "react-json-editor-ajrm";
import ErrorScreen from "../partials/Error";

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

  useEffect(() => {
    axios
      .get(`/api/jsonschemas/${schema_name}/${schema_version || ""}`)
      .then(res => {
        setOriginalSchema(res.data);
        setSchema(res.data);
        setField(res.data);
        let opts = Object.entries(res.data)
          .filter(
            e =>
              typeof e[1] === "object" && e[1] !== null && !Array.isArray(e[1])
          )
          .map(e => ({
            label: e[0],
            value: e[0],
          }));
        opts.unshift({ label: FULL_SCHEMA, value: "all" });
        setOptions(opts);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  const handleSelectChange = (value, option) => {
    if (value === "all") {
      setField(schema);
    } else {
      setField(schema[value]);
    }
    setSelection(option.label);
  };

  const handleEdit = value => {
    if (!value.error) {
      const jsObject = value.jsObject;
      if (selection === FULL_SCHEMA) {
        setSchema(jsObject);
      } else {
        setSchema({ ...schema, [selection]: jsObject });
      }
      setField(jsObject);
    }
    setJsonError(value.error);
  };

  const handleSave = () => {
    let schemaToSave = schema;
    if (selection != FULL_SCHEMA) {
      schemaToSave = { ...originalSchema, [selection]: schema[selection] };
    }
    axios
      .put(`/api/jsonschemas/${schema_name}/${schema.version}`, schemaToSave)
      .then(() => {
        setOriginalSchema(schema);
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
        <React.Fragment>
          <Modal
            visible={showModal}
            onCancel={() => setShowModal(false)}
            title={`${selection} diff`}
            width={800}
            footer={null}
            bodyStyle={{
              overflowX: "scroll",
              overflowY: "auto",
              maxHeight: "calc(100vh - 200px)",
            }}
          >
            <JsonDiff
              left={
                selection === FULL_SCHEMA
                  ? originalSchema
                  : originalSchema[selection]
              }
              right={field}
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
                    {schema_name} {schema_version}
                  </Typography.Title>
                </Col>
                <Col>
                  <Tooltip
                    placement="bottom"
                    title="Select a field to edit it (if it is editable). 
                  Check the diff, revert or save the changes to that field, 
                  or go back to 'Full schema' to check the full diff, 
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
                          ? "View full diff"
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
                      selection === FULL_SCHEMA
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
                        !EDITABLE_FIELDS.includes(selection) &&
                        selection != FULL_SCHEMA
                      }
                    />
                  </Tooltip>
                </Col>
              </Row>
              <Row justify="center">
                <Col xs={24}>
                  <JSONInput
                    width="100%"
                    height="calc(100vh - 19em)"
                    placeholder={field}
                    onChange={handleEdit}
                    viewOnly={!EDITABLE_FIELDS.includes(selection)}
                    theme="light_mitsuketa_tribute"
                    onKeyPressUpdate={false}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </React.Fragment>
      )}
    </DocumentTitle>
  );
};

export default Schemas;
