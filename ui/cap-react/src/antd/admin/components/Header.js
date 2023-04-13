import React, { useState } from "react";
import PropTypes from "prop-types";
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
  Button,
  Tooltip,
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
import { json } from "@codemirror/lang-json";
import CodeDiffViewer from "../../utils/CodeDiffViewer";

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
          height="100%"
        />
      ),
      schema: (
        <CodeViewer
          value={JSON.stringify(schema.toJS(), null, 2)}
          lang={json}
          height="100%"
        />
      ),
      uiSchemaDiff: (
        <CodeDiffViewer
          left={JSON.stringify(initialUiSchema.toJS(), null, 2)}
          right={JSON.stringify(uiSchema.toJS(), null, 2)}
          lang={json}
          height="100%"
        />
      ),
      schemaDiff: (
        <CodeDiffViewer
          left={JSON.stringify(initialSchema.toJS(), null, 2)}
          right={JSON.stringify(schema.toJS(), null, 2)}
          lang={json}
          height="100%"
        />
      ),
    };

    return previews[schemaPreviewDisplay]; //?
  };

  const getMenuItem = (key, label, icon, onClick, type) => ({
    key,
    label: (
      <Tooltip title={!screens.lg && label}>
        <Button icon={icon} type={type || "text"} onClick={onClick}>
          {screens.lg && label}
        </Button>
      </Tooltip>
    ),
    style: { padding: "0 10px 0 0" },
  });

  return (
    <Row align="middle" style={{ color: "#fff" }}>
      <Modal
        open={diffModal}
        onCancel={() => setDiffModal(false)}
        width={1000}
        footer={null}
      >
        <Tabs
          defaultActiveKey="schema"
          items={[
            {
              key: "schema",
              label: "Schema",
              children: _renderSchemaPreview("schema"),
              style: diffModalTabStyle,
            },
            {
              key: "uiSchema",
              label: "UI Schema",
              children: _renderSchemaPreview("uiSchema"),
              style: diffModalTabStyle,
            },
            {
              key: "schemaDiff",
              label: "Schema Diff",
              children: _renderSchemaPreview("schemaDiff"),
              style: diffModalTabStyle,
            },
            {
              key: "uiSchemaDiff",
              label: "UI Schema Diff",
              children: _renderSchemaPreview("uiSchemaDiff"),
              style: diffModalTabStyle,
            },
          ]}
        />
      </Modal>
      <Modal
        open={settingsModal}
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

      <Col xs={4} sm={4} lg={5} order={1}>
        <Menu
          mode="horizontal"
          className="no-bottom-border"
          items={[
            {
              key: "admin",
              label: (
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
                  <Button type="text" icon={<ArrowLeftOutlined />}>
                    {screens.lg && "Admin Home Page"}
                  </Button>
                </Popconfirm>
              ),
              style: { padding: "0 10px" },
            },
          ]}
        />
      </Col>
      <Col xs={{ span: 24, order: 3 }} sm={{ span: 11, order: 2 }} lg={7}>
        <Menu
          mode="horizontal"
          selectedKeys={display}
          style={{ justifyContent: screens.sm ? "flex-end" : "center" }}
          onClick={({ key }) => setDisplay(key)}
          items={[
            { key: "builder", label: "Form Builder", icon: <FormOutlined /> },
            {
              key: "notifications",
              label: "Notifications",
              icon: <NotificationOutlined />,
            },
          ]}
        />
      </Col>
      <Col xs={{ span: 20, order: 2 }} sm={{ span: 9, order: 3 }} lg={12}>
        <Menu
          mode="horizontal"
          selectable={false}
          style={{
            justifyContent: "flex-end",
          }}
          className="no-bottom-border"
          items={[
            getMenuItem("export", "Export Schema", <DownloadOutlined />, () =>
              _getSchema()
            ),
            getMenuItem("diff", "Diff", <DiffOutlined />, () =>
              setDiffModal(true)
            ),
            getMenuItem("settings", "Settings", <SettingOutlined />, () =>
              setSettingsModal(true)
            ),
            getMenuItem(
              "save",
              "Save updates",
              <SaveOutlined />,
              () => saveSchemaChanges(),
              "primary"
            ),
          ]}
        />
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
