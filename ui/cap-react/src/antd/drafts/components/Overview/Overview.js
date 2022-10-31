import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Space,
  Tag,
  Typography
} from "antd";
import { transformSchema } from "../../utils/transformSchema";
import JSONSchemaPreviewer from "../../../../components/drafts/form/JSONSchemaPreviewer";
import {
  CodeOutlined,
  FolderOutlined,
  InfoCircleOutlined,
  UserOutlined
} from "@ant-design/icons";
import OverviewLoading from "./OverviewLoading";
import DepositFilesList from "../../../partials/FileList";
import { calculateCollaborators } from "../../utils/calculateCollaborators";
import InfoArrayBox from "../../../../components/partials/InfoArrayBox";
import Reviews from "../../../partials/Reviews";

const Overview = ({
  canUpdate,
  schemas = { schema: null },
  metadata,
  schema,
  webhooks,
  files,
  edit,
  draft_id,
  status,
  revision,
  mySchema,
  access,
  loading,
  history
}) => {
  const { users, roles } = useMemo(() => calculateCollaborators(access), [
    access
  ]);

  const infoArray = [
    {
      text: <Typography.Text>{revision} revision</Typography.Text>,
      icon: <InfoCircleOutlined />
    },
    {
      text: (
        <Typography.Text>
          {" "}
          {users || 0} users / {roles || 0} roles
        </Typography.Text>
      ),
      icon: <UserOutlined />
    },
    {
      text: (
        <Typography.Text>
          {webhooks && webhooks.length} repositories
        </Typography.Text>
      ),
      icon: <CodeOutlined />
    },
    {
      text: <Typography.Text>{files && files.size} files</Typography.Text>,
      icon: <FolderOutlined />
    },
    {
      text: (
        <Typography.Text>
          {" "}
          {(schema && schema.version) || "-"} schema version
        </Typography.Text>
      ),
      icon: <InfoCircleOutlined />
    }
  ];
  if (loading)
    return (
      <Col xxl={16} lg={18} xs={22} sm={22}>
        <OverviewLoading />
      </Col>
    );
  return (
    <Col xxl={16} lg={18} xs={22} sm={22}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Row
          justify="space-around"
          style={{ background: "#fff", padding: "5px 0" }}
        >
          {infoArray.map((item, idx) => (
            <Tag key={idx} icon={item.icon} style={{ margin: "5px" }}>
              {item.text}
            </Tag>
          ))}
        </Row>
        {status == "published" && (
          <Alert
            type="warning"
            message="Warning"
            description="This is a published version. If you want to upload files and repos or update form metadata and the title you have to change to Draft mode"
            showIcon
            action={
              <Button
                data-cy="changeToDraftButton"
                onClick={() => edit(draft_id)}
              >
                Change to Draft
              </Button>
            }
          />
        )}
        {mySchema &&
          mySchema.name == "cms-stats-questionnaire" && (
            <Alert
              type="warning"
              showIcon
              message="Warning"
              description={
                <Typography.Text>
                  For your {(mySchema && mySchema.fullname) || "document"} , to
                  be <Typography.Text strong>reviewed</Typography.Text> you need
                  to <Typography.Text strong>Publish</Typography.Text> it first
                  (through settings tab)
                </Typography.Text>
              }
            />
          )}

        <Card
          title="Metadata"
          extra={
            <Space size="middle">
              {canUpdate && (
                <Button
                  key="edit"
                  onClick={() => {
                    history.push(`/drafts/${draft_id}/edit`);
                  }}
                >
                  Edit
                </Button>
              )}
              <Button
                key="more"
                onClick={() => {
                  history.push({
                    pathname: `/drafts/${draft_id}/edit`,
                    state: { mode: "preview" }
                  });
                }}
              >
                Show More
              </Button>
            </Space>
          }
        >
          {schemas &&
            schemas.schema && (
              <div style={{ maxHeight: "30vh", overflowX: "hidden" }}>
                <JSONSchemaPreviewer
                  formData={metadata}
                  schema={transformSchema(schemas.schema)}
                  schemaType={mySchema}
                  uiSchema={schemas.uiSchema || {}}
                  onChange={() => {}}
                >
                  <span />
                </JSONSchemaPreviewer>
              </div>
            )}
        </Card>
        <Reviews />
        <Card title="Connected Repositories">
          {webhooks && webhooks.length > 0 ? (
            <InfoArrayBox items={webhooks} type="repositories" />
          ) : (
            <Empty description="No connected repositories yet" />
          )}
        </Card>
        <Card title="Uploaded Repositories">
          {files &&
          files.size > 0 &&
          files.filter(item => item.key.startsWith("repositories")).size > 0 ? (
            <DepositFilesList files={files} renderList={["repositories"]} />
          ) : (
            <Empty description="No uploaded repositories yet" />
          )}
        </Card>
        <Card title="Uploaded Files">
          {files &&
          files.size > 0 &&
          files.filter(item => !item.key.startsWith("repositories")).size >
            0 ? (
            <DepositFilesList files={files} renderList={["files"]} />
          ) : (
            <Empty description="No uploaded files yet" />
          )}
        </Card>
      </Space>
    </Col>
  );
};

Overview.propTypes = {
  canUpdate: PropTypes.bool,
  schemas: PropTypes.object,
  metadata: PropTypes.object,
  schema: PropTypes.object,
  webhooks: PropTypes.object,
  files: PropTypes.object,
  edit: PropTypes.func,
  draft_id: PropTypes.string,
  status: PropTypes.string,
  revision: PropTypes.string,
  mySchema: PropTypes.object,
  access: PropTypes.object,
  loading: PropTypes.bool,
  history: PropTypes.object
};

export default Overview;
