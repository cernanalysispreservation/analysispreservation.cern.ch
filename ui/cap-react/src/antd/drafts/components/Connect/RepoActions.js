import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Space,
  Tag,
  Typography,
} from "antd";
import { GithubOutlined, GitlabOutlined } from "@ant-design/icons";

const RepoActions = ({ myRepo, uploadRepo, error }) => {
  const [addFilepath, setAddFilepath] = useState(false);
  const [disableUploadButton, setDisableUploadButton] = useState(false);
  const [loading, setLoading] = useState(null);
  const [myform] = Form.useForm();

  useEffect(() => {
    setLoading(null);
    if (myRepo && myRepo.filepath && myRepo.filepath.length > 0 && !addFilepath)
      setAddFilepath(true);

    if (myRepo && !myRepo.filepath && addFilepath) setAddFilepath(false);
  }, [error, myRepo]);
  return (
    myRepo && (
      <Space
        direction="vertical"
        style={{
          background: "#f0f2f5",
          padding: "10px",
          width: "100%",
        }}
      >
        <Typography.Title level={5}>
          You have selected the following repository:
        </Typography.Title>

        {myRepo.owner && myRepo.name && (
          <Tag
            icon={
              myRepo.resource.includes("github") ? (
                <GithubOutlined />
              ) : (
                <GitlabOutlined />
              )
            }
          >
            {myRepo.owner}/{myRepo.name}
          </Tag>
        )}
        <Form
          form={myform}
          layout="inline"
          initialValues={{ ref: myRepo.ref, filepath: myRepo.filepath }}
          onValuesChange={() =>
            myform
              .validateFields()
              .catch(e =>
                e.errorFields.length > 0
                  ? !disableUploadButton && setDisableUploadButton(true)
                  : disableUploadButton && setDisableUploadButton(false)
              )
          }
        >
          <Form.Item
            name="uploadfile"
            label="Upload a specific file and not the whole repo"
          >
            <Checkbox
              checked={addFilepath}
              onChange={e => setAddFilepath(e.target.checked)}
            />
          </Form.Item>
          <Form.Item
            name="ref"
            label="Branch/Ref"
            rules={[{ required: addFilepath }]}
          >
            <Input placeholder="Define specific branch/ref" />
          </Form.Item>
          {addFilepath && (
            <Form.Item
              name="filepath"
              label="Filepath"
              rules={[{ required: addFilepath }]}
            >
              <Input placeholder="Define the filepath" />
            </Form.Item>
          )}
        </Form>
        <Card
          title="Upload snapshot of repository"
          extra={
            <Button
              disabled={disableUploadButton}
              loading={loading == "upload"}
              onClick={() => {
                setLoading("upload");
                myform
                  .validateFields()
                  .then(() =>
                    uploadRepo(
                      false,
                      null,
                      myform.getFieldsValue().ref,
                      myform.getFieldsValue().filepath
                    )
                  )
                  .catch(() => setLoading(null));
              }}
              type="primary"
            >
              Upload
            </Button>
          }
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Typography.Text>
              Upload and preserve the current snapshot of a repository on a
              branch, release/tag or ref
            </Typography.Text>
            {error && error.type == "upload" && (
              <Space>
                <Alert
                  showIcon
                  type="error"
                  message={
                    error.message ||
                    "Something happened when creating the upload task"
                  }
                />
              </Space>
            )}
          </Space>
        </Card>
        {!addFilepath && (
          <>
            <Card
              title="Automatically Upload on release"
              extra={
                <Button
                  loading={loading == "release"}
                  onClick={() => {
                    setLoading("release");
                    uploadRepo(true, "release", myform.getFieldsValue().ref);
                  }}
                  type="primary"
                >
                  Upload onRelease
                </Button>
              }
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="large"
              >
                <Typography.Text>
                  Create a webhook and give us permission to automatically
                  upload a snapshot of a repository, when a new version is
                  released or a tag is created
                </Typography.Text>
                {error && error.type == "release" && (
                  <Space>
                    <Alert
                      showIcon
                      type="error"
                      message={
                        error.message ||
                        "Something happened when creating the upload task"
                      }
                    />
                    <Alert
                      showIcon
                      type="warning"
                      message="Only owners or accounts with write access to the repository are allowed to do this"
                    />
                  </Space>
                )}
              </Space>
            </Card>
            <Card
              title="Automatically Upload on push event"
              extra={
                <Button
                  loading={loading == "push"}
                  onClick={() => {
                    setLoading("push");
                    uploadRepo(true, "push", myform.getFieldsValue().ref);
                  }}
                  type="primary"
                >
                  Upload onPush
                </Button>
              }
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="large"
              >
                <Typography.Paragraph>
                  Create a webhook and give us permission to automatically
                  upload a snapshot of a repository, when a push event takes
                  place
                </Typography.Paragraph>
                {error && error.type == "push" && (
                  <Space>
                    <Alert
                      showIcon
                      type="error"
                      message={
                        error.message ||
                        "Something happened when creating the upload task"
                      }
                    />
                    <Alert
                      showIcon
                      type="warning"
                      message="Only owners or accounts with write access to the repository are allowed to do this"
                    />
                  </Space>
                )}
              </Space>
            </Card>
          </>
        )}
      </Space>
    )
  );
};

RepoActions.propTypes = {
  myRepo: PropTypes.object,
  uploadRepo: PropTypes.func,
  error: PropTypes.object,
};

export default RepoActions;
