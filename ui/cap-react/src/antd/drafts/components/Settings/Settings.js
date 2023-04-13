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
} from "antd";
import { Link } from "react-router-dom";
import { LinkOutlined, DeleteTwoTone } from "@ant-design/icons";
import Reviews from "../../../partials/Reviews";
import Permissions from "../../containers/Permissions";
import equal from "deep-equal";
import cleanDeep from "clean-deep";

const Settings = ({
  recid,
  status,
  formData,
  metadata,
  draft_id,
  publishDraft,
  updateDraft,
  deleteDraft,
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
  return (
    <Row justify="center">
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
          <Permissions />
          <Reviews />
          <Alert
            message="Delete"
            description={
              status === "draft" && !recid ? (
                <Typography.Paragraph>
                  <Typography.Text strong>Delete</Typography.Text> permantly
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
