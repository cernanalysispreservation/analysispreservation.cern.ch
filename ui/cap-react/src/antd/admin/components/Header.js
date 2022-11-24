import React, { useState } from "react";
import PropTypes from "prop-types";
import JsonDiff from "./JSONDiff";
import Form from "../../forms/Form";
import { Button, Col, Menu, Modal, Row, Tabs, Grid } from "antd";
import {
  ArrowLeftOutlined,
  DiffOutlined,
  DownloadOutlined,
  FormOutlined,
  NotificationOutlined,
  SaveOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { CMS } from "../../routes";
import { configSchema } from "../utils/schemaSettings";
import CodeViewer from "../../util/CodeViewer";
import { json, jsonParseLinter } from "@codemirror/lang-json";

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
  updateSchemaConfig,
}) => {
  const [diffModal, setDiffModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const screens = useBreakpoint();

  const diffModalTabStyle = {
    overflowX: "scroll",
    overflowY: "auto",
    maxHeight: "calc(100vh - 300px)",
  };

  const _getSchema = () => {
    const fileData = JSON.stringify(
      {
        deposit_schema: schema.toJS(),
        deposit_options: uiSchema.toJS(),
        ...config.toJS(),
      },
      null,
      4
    );

    const a = document.createElement("a");
    const file = new Blob([fileData], { type: "text/json" });
    a.href = URL.createObjectURL(file);
    a.download = "fileName.json"; //TODO: Should be a proper name
    a.click();
  };
  const _renderSchemaPreview = schemaPreviewDisplay => {
    let previews = {
      uiSchema: (
        <CodeViewer
          value={JSON.stringify(uiSchema.toJS(), null, 2)}
          lang={json}
          lint={jsonParseLinter}
          height="100%"
        />
      ),
      schema: (
        <CodeViewer
          value={JSON.stringify(schema.toJS(), null, 2)}
          lang={json}
          lint={jsonParseLinter}
          height="100%"
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
      ),
    };

    return previews[schemaPreviewDisplay]; //?
  };
  return (
    <Row align="middle" style={{ color: "#fff" }}>
      <Modal
        visible={diffModal}
        onCancel={() => setDiffModal(false)}
        width={1000}
        footer={null}
      >
        <Tabs defaultActiveKey="schema">
          <Tabs.TabPane tab="Schema" key="schema" style={diffModalTabStyle}>
            {_renderSchemaPreview("schema")}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="UI Schema"
            key="uiSchema"
            style={diffModalTabStyle}
          >
            {_renderSchemaPreview("uiSchema")}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="Schema Diff"
            key="schemaDiff"
            style={diffModalTabStyle}
          >
            {_renderSchemaPreview("schemaDiff")}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="UI Schema Diff"
            key="uiSchemaDiff"
            style={diffModalTabStyle}
          >
            {_renderSchemaPreview("uiSchemaDiff")}
          </Tabs.TabPane>
        </Tabs>
      </Modal>
      <Modal
        title="Schema Settings"
        visible={settingsModal}
        onCancel={() => setSettingsModal(false)}
        okButtonProps={{
          onClick: () => setSettingsModal(false),
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
            justifyContent: "flex-end",
          }}
        >
          <Menu.Item
            key="builder"
            icon={<FormOutlined />}
            onClick={() =>
              pushPath(pathname.split("notifications")[0] + "builder")
            }
          >
            Form Builder
          </Menu.Item>
          <Menu.Item
            key="notifications"
            icon={<NotificationOutlined />}
            onClick={() =>
              pushPath(pathname.split("builder")[0] + "notifications")
            }
          >
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
            justifyContent: screens.md ? "flex-end" : "center",
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
  pathname: PropTypes.string,
};

export default Header;
