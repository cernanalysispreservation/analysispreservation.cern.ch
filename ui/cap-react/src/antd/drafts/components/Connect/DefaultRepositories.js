import PropTypes from "prop-types";
import {
  Alert,
  Button,
  Card,
  Space,
  Typography,
  Collapse,
  Tag,
  Descriptions,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import { GithubOutlined, GitlabOutlined } from "@ant-design/icons";

const Connect = ({ draftID, repos = [], repoConfig = {}, upload }) => {
  let { config: { repositories = {} } = {} } = repoConfig || {};

  const createDefaultRepo = (type_name, config) => {
    upload(draftID, type_name, config);
  };
  const genExtra = (key, connected = false, config = {}) => (
    <Space>
      {connected ? (
        <Tag color="green">Connected</Tag>
      ) : (
        <Button
          icon={<UploadOutlined />}
          size="small"
          type="primary"
          onClick={event => {
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation();
            createDefaultRepo(key, config);
          }}
        >
          Create & Connect
        </Button>
      )}
    </Space>
  );

  if (Object.keys(repositories).length == 0) return null;
  return (
    <Card title="Default repositories">
      <Typography.Paragraph>
        <strong>Default repositories</strong> are predefined source code
        repositories (templated or custom), created by the admins of the
        collection. Its purpose is to have a unified and standard way for all
        collection entries to easily preserve and share the code and the data.
      </Typography.Paragraph>
      <Alert
        message="You will be able to see the added repositories in the 'Connected
            Repositories' section"
        type="info"
        showIcon
      />

      <Space
        direction="vertical"
        size={"middle"}
        style={{ display: "flex", padding: "10px 0" }}
      >
        <Collapse expandIconPosition="end">
          {Object.entries(repositories).map(([key, value]) => (
            <CollapsePanel
              showAfrrow={false}
              key={key}
              header={
                <Space align="center">
                  {value.host == "github.com" ? (
                    <GithubOutlined />
                  ) : (
                    <GitlabOutlined />
                  )}{" "}
                  <Typography.Text strong>
                    {value.display_name || key}
                  </Typography.Text>
                </Space>
              }
              extra={genExtra(
                key,
                repos.filter(
                  r =>
                    r.host == value.host &&
                    r.name == value.default_name &&
                    r.owner == value.org_name
                      ? true
                      : false
                ).length > 0
                  ? true
                  : false,
                value
              )}
            >
              <Typography.Paragraph>
                {value.display_description}
              </Typography.Paragraph>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Host">{value.host}</Descriptions.Item>
                <Descriptions.Item label="License">
                  {value.license || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Organisation/Group name">
                  {value.org_name}
                </Descriptions.Item>
                <Descriptions.Item label="Authentication">
                  {value.authentication
                    ? value.authentication.type == "cap"
                      ? "CAP"
                      : "Personal"
                    : null}
                </Descriptions.Item>
                <Descriptions.Item label="Repository name">
                  {value.repo_name ? (
                    value.repo_name.template_file ? (
                      <Space>
                        {value.repo_name.template_file} <Tag>Template file</Tag>
                      </Space>
                    ) : (
                      <Space>
                        {value.repo_name.template} <Tag>Template string</Tag>
                      </Space>
                    )
                  ) : null}
                </Descriptions.Item>
                <Descriptions.Item>
                  {value.org_name}/{value.default_name}
                </Descriptions.Item>
              </Descriptions>
            </CollapsePanel>
          ))}
        </Collapse>
      </Space>
    </Card>
  );
};

Connect.propTypes = {
  repos: PropTypes.array,
  repo: PropTypes.object,
  canUpdate: PropTypes.bool,
  uploadViaRepoUrl: PropTypes.func,
  id: PropTypes.string,
};

export default Connect;
