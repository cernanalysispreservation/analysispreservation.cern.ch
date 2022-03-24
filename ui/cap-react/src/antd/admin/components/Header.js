import React, { useState } from "react";
import PropTypes from "prop-types";
import AceEditor from "react-ace";
import JsonDiff from "./JSONDiff";
import "ace-builds/webpack-resolver";
import Form from "../../forms/Form";
import { Button, Col, Menu, Modal, Row, Tabs, Grid } from "antd";
import {
  ArrowLeftOutlined,
  DiffOutlined,
  DownloadOutlined,
  FormOutlined,
  NotificationOutlined,
  SaveOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { CMS } from "../../routes";
import { configSchema } from "../utils/schemaSettings";
const { useBreakpoint } = Grid;
const Header = ({
  config,
  pushPath,
  pathname,
  saveSchemaChanges,
  schema,
  uiSchema,
  initialUiSchema,
  initialSchema,
  updateSchemaConfig
}) => {
  const [diffModal, setDiffModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const screens = useBreakpoint();

  const _getSchema = () => {
    const fileData = JSON.stringify(
      {
        deposit_schema: schema.toJS(),
        deposit_options: uiSchema.toJS(),
        ...config.toJS()
      },
      null,
      4
    );

    const a = document.createElement("a");
    const file = new Blob([fileData], { type: "text/json" });
    a.href = URL.createObjectURL(file);
    a.download = "fileName.json";
    a.click();
  };
  const _renderSchemaPreview = schemaPreviewDisplay => {
    let previews = {
      uiSchema: (
        <AceEditor
          value={JSON.stringify(uiSchema.toJS(), null, 4)}
          mode="json"
          width="100%"
          height="100vh"
          readonly
        />
      ),
      schema: (
        <AceEditor
          value={JSON.stringify(schema.toJS(), null, 4)}
          mode="json"
          width="100%"
          height="100vh"
          readonly
        />
      ),
      uiSchemaDiff: (
        <JsonDiff
          left={initialUiSchema.toJS()}
          right={uiSchema.toJS()}
          show={false}
        />
      ),
      schemaDiff: (
        <JsonDiff
          left={initialSchema.toJS()}
          right={schema.toJS()}
          show={false}
        />
      )
    };

    return previews[schemaPreviewDisplay]; //?
  };
  return (
    <Row align="middle" style={{ color: "#fff" }}>
      <Modal
        visible={diffModal}
        onCancel={() => setDiffModal(false)}
        width={1000}
      >
        <Tabs defaultActiveKey="schema">
          <Tabs.TabPane tab="Schema" key="schema">
            {_renderSchemaPreview("schema")}
          </Tabs.TabPane>
          <Tabs.TabPane tab="UI Schema" key="uiSchema">
            {_renderSchemaPreview("uiSchema")}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Schema Diff" key="schemaDiff">
            {_renderSchemaPreview("schemaDiff")}
          </Tabs.TabPane>
          <Tabs.TabPane tab="UI Schema Diff" key="uiSchemaDiff">
            {_renderSchemaPreview("uiSchemaDiff")}
          </Tabs.TabPane>
        </Tabs>
      </Modal>
      <Modal
        title="Schema Settings"
        visible={settingsModal}
        onCancel={() => setSettingsModal(false)}
        okButtonProps={{
          onClick: () => setSettingsModal(false)
        }}
      >
        <Form
          {...configSchema}
          formData={config.toJS()}
          onChange={data => updateSchemaConfig(data.formData)}
        />
      </Modal>

      <Col xs={8} md={4}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => pushPath(CMS)}
          type="primary"
        >
          Admin Home Page
        </Button>
      </Col>
      <Col xs={16} md={10}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={
            pathname.includes("/builder") ? ["builder"] : ["notifications"]
          }
          style={{
            justifyContent: "flex-end"
          }}
        >
          <Menu.Item key="builder" icon={<FormOutlined />}>
            Form Builder
          </Menu.Item>
          <Menu.Item key="notifications" icon={<NotificationOutlined />}>
            Notifications
          </Menu.Item>
        </Menu>
      </Col>
      <Col xs={24} md={10}>
        <Menu
          mode="horizontal"
          theme="dark"
          selectable={false}
          style={{
            justifyContent: screens.md ? "flex-end" : "center"
          }}
        >
          <Menu.Item icon={<DownloadOutlined />} onClick={() => _getSchema()}>
            Export Schema
          </Menu.Item>
          <Menu.Item
            icon={<SaveOutlined />}
            onClick={() => saveSchemaChanges()}
          >
            Save Updates
          </Menu.Item>
          <Menu.Item icon={<DiffOutlined />} onClick={() => setDiffModal(true)}>
            Diff
          </Menu.Item>
          <Menu.Item
            icon={<SettingOutlined />}
            onClick={() => setSettingsModal(true)}
          >
            Settings
          </Menu.Item>
        </Menu>
      </Col>
    </Row>
  );
};

Header.propTypes = {
  config: PropTypes.object,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  initialUiSchema: PropTypes.object,
  initialSchema: PropTypes.object,
  pushPath: PropTypes.func,
  updateSchemaConfig: PropTypes.func,
  saveSchemaChanges: PropTypes.func,
  pathname: PropTypes.string
};

export default Header;
