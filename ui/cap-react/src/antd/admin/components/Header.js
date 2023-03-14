import React, { useState } from "react";
import PropTypes from "prop-types";
import JsonDiff from "./JSONDiff";
import Form from "../../forms/Form";
import {
  Col,
  Menu,
  Modal,
  Row,
  Tabs,
  Grid,
  Popconfirm,
  Typography,
} from "antd";
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
import CodeViewer from "../../utils/CodeViewer";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import HeaderMenuItem from "./HeaderMenuItem/HeaderMenuItem";

const { useBreakpoint } = Grid;
const Header = ({
  config,
  pushPath,
  saveSchemaChanges,
  schema,
  uiSchema,
  initialUiSchema,
  initialSchema,
  updateSchemaConfig,
  display,
  setDisplay,
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

      <Col xs={4} lg={4} order={1}>
        <Menu mode="horizontal" className="no-bottom-border">
          <Popconfirm
            title={
              <Typography.Text>
                Are you sure you want to go back to the admin screen?
                <br />You will lose all unsaved changes
              </Typography.Text>
            }
            okType="link"
            okText="Leave"
            cancelText="Keep editing"
            placement="bottom"
            onConfirm={() => pushPath(CMS)}
          >
            <HeaderMenuItem
              icon={<ArrowLeftOutlined />}
              label={screens.md && "Admin Home Page"}
            />
          </Popconfirm>
        </Menu>
      </Col>
      <Col xs={{ span: 24, order: 3 }} sm={{ span: 11, order: 2 }} lg={7}>
        <Menu
          mode="horizontal"
          selectedKeys={display}
          style={{ justifyContent: screens.sm ? "flex-end" : "center" }}
        >
          <Menu.Item
            key="builder"
            icon={<FormOutlined />}
            onClick={() => setDisplay("builder")}
          >
            Form Builder
          </Menu.Item>
          <Menu.Item
            key="notifications"
            icon={<NotificationOutlined />}
            onClick={() => setDisplay("notifications")}
          >
            Notifications
          </Menu.Item>
        </Menu>
      </Col>
      <Col xs={{ span: 20, order: 2 }} sm={{ span: 9, order: 3 }} lg={13}>
        <Menu
          mode="horizontal"
          selectable={false}
          style={{
            justifyContent: "flex-end",
          }}
          className="no-bottom-border"
        >
          <HeaderMenuItem
            icon={<DownloadOutlined />}
            onClick={() => _getSchema()}
            label="Export Schema"
          />
          <HeaderMenuItem
            icon={<DiffOutlined />}
            onClick={() => setDiffModal(true)}
            label="Diff"
          />
          <HeaderMenuItem
            icon={<SettingOutlined />}
            onClick={() => setSettingsModal(true)}
            label="Settings"
          />
          <HeaderMenuItem
            icon={<SaveOutlined />}
            onClick={() => saveSchemaChanges()}
            label="Save Updates"
            type="primary"
          />
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
