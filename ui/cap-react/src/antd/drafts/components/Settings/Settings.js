import { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Typography,
  Popconfirm,
  Modal,
  Alert,
  Input,
  Form,
  Table,
} from "antd";
import { Link } from "react-router-dom";
import { LinkOutlined, DeleteTwoTone, PlusCircleFilled } from "@ant-design/icons";
import Reviews from "../../../partials/Reviews";
import Permissions from "../../containers/Permissions";
import equal from "deep-equal";
import cleanDeep from "clean-deep";

const Settings = ({
  recid,
  status,
  egroups,
  formData,
  metadata,
  draft_id,
  publishDraft,
  updateDraft,
  deleteDraft,
  addEgroupToDraft,
  canUpdate,
}) => {
  const publishMyDraft = () => {
    equal(cleanDeep(formData), cleanDeep(metadata))
      ? publishDraft(draft_id)
      : updateDraft({ ...formData }, draft_id).then(() => {
          publishDraft(draft_id);
        });

    setConfirmPublish(false);
  };
  const [confirmPublish, setConfirmPublish] = useState(false);
  const [createModalEnabled, setCreateModalEnabled] = useState(false);

  const _addEgroup = group => {
    addEgroupToDraft(draft_id, group);
  };
  return (
    <Row justify="center" style={{ padding: "20px" }}>
      <Modal
        open={confirmPublish}
        title="Publish Draft"
        onCancel={() => setConfirmPublish(false)}
        okButtonProps={{
          onClick: publishMyDraft,
          "data-cy": "draftSettingsPublish",
        }}
        okText="Publish"
      >
        {equal(cleanDeep(formData), cleanDeep(metadata)) ? (
          "Do you really want to publish?"
        ) : (
          <Alert
            message="You are trying to publish with unsaved changes"
            description="if you decide to continue, these changes will be saved first"
            type="warning"
            showIcon
          />
        )}
      </Modal>
      <Col xs={22} sm={22} lg={18} xxl={16}>
        <Space direction="vertical" size="middle">
          <Card
            title="Publish your Analysis"
            extra={
              <Button
                data-cy="draftSettingsRecidButton"
                type="primary"
                onClick={() => setConfirmPublish(true)}
                disabled={status != "draft" || !canUpdate}
              >
                {recid ? "Publish new Version" : "Publish"}
              </Button>
            }
            actions={
              recid && [
                <Link
                  key="button"
                  to={`/published/${recid}`}
                  data-cy="draftSettingsCurrentVersionLink"
                >
                  <Button type="link" icon={<LinkOutlined />}>
                    Current Version
                  </Button>
                </Link>,
              ]
            }
          >
            <Typography.Paragraph>
              <Typography.Text strong>Publishing</Typography.Text> is the way to
              preserve your work within CAP (and CAP only). It makes a snapshot
              of everything that your analysis contains - metadata, files,
              plots, repositories - assigning to it an unique versioned
              identifier. All members of your collaboration can search and
              reference published content. Once published, an analysis cannot be
              deleted, but it can be modified and published again with a new
              version tag.
            </Typography.Paragraph>
          </Card>

          {egroups && (
            <Card
              title="CERN E-groups"
              size="small"
              extra={
                <Button
                  size="small"
                  icon={<PlusCircleFilled size={10} />}
                  onClick={() => setCreateModalEnabled(true)}
                  type="default"
                >
                  Create e-group
                </Button>
              }
            >
              <Typography.Paragraph stfyle={{ padding: 0, margin: 0 }}>
                Here you can find and link{" "}
                <Typography.Text strong>CERN E-groups</Typography.Text>{" "}
                associated with this entry
              </Typography.Paragraph>
              <Modal
                open={createModalEnabled}
                centered
                title="Create & link new egroup"
                description="Create & link new egroup"
                footer={false}
                onCancel={() => setCreateModalEnabled(false)}
              >
                <Form onFinish={_addEgroup} layout="vertical">
                  {/* <Space.Compact> */}
                  <Form.Item
                    name="name"
                    label="E-group Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input an e-group name",
                      },
                    ]}
                  >
                    <Input
                      placeholder={`e.g. CAP-${draft_id}-admins`.toLowerCase()}
                    ></Input>
                  </Form.Item>
                  <Form.Item name="description" label="Description">
                    <Input.TextArea
                      placeholder={`e.g. This is an ${draft_id} associated e-group for reviewers..`}
                    ></Input.TextArea>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Add egroup
                    </Button>
                  </Form.Item>
                  {/* </Space.Compact> */}
                </Form>
              </Modal>
              <Table
                dataSource={egroups}
                size="small"
                columns={[
                  {
                    key: "name",
                    dataIndex: "name",
                    title: "E-Group Name",
                    width: "35%",
                    render: i => <Typography.Text code>{i}</Typography.Text>,
                  },
                  {
                    key: "description",
                    dataIndex: "description",
                    title: "Description",
                    width: "65%",
                  },
                ]}
              />
            </Card>
          )}
          <Permissions />
          <Reviews />
          <Alert
            message="Delete"
            description={
              status === "draft" && !recid ? (
                <Typography.Paragraph>
                  <Typography.Text strong>Delete</Typography.Text> permanently
                  your analysis and all metadata
                </Typography.Paragraph>
              ) : (
                <Typography.Paragraph>
                  Your analysis has been already{" "}
                  <Typography.Text strong>published once</Typography.Text> and
                  is{" "}
                  <Typography.Text strong> no longer a draft</Typography.Text>.
                  Therefore it is not possible to delete it
                </Typography.Paragraph>
              )
            }
            type="error"
            action={
              recid ? (
                <Button type="danger" disabled data-cy="draft-delete-btn">
                  Delete
                </Button>
              ) : (
                <Popconfirm
                  key="delete"
                  title="Do you really want to delete this draft?"
                  okText="Delete"
                  okButtonProps={{ type: "danger" }}
                  icon={<DeleteTwoTone twoToneColor="#ff4d4f" />}
                  onConfirm={() => deleteDraft(draft_id)}
                >
                  <Button danger data-cy="draft-delete-btn">
                    Delete
                  </Button>
                </Popconfirm>
              )
            }
          />
        </Space>
      </Col>
    </Row>
  );
};

Settings.propTypes = {
  recid: PropTypes.string,
  status: PropTypes.string,
  formData: PropTypes.object,
  metadata: PropTypes.object,
  draft_id: PropTypes.string,
  publishDraft: PropTypes.func,
  updateDraft: PropTypes.func,
  deleteDraft: PropTypes.func,
  canUpdate: PropTypes.bool,
};

export default Settings;
