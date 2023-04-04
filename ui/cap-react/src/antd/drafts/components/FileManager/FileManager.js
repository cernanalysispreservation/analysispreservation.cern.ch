import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Typography,
  Upload,
} from "antd";
import {
  CheckCircleTwoTone,
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { _getIcon } from "../../../partials/FileList/utils/getFileItemIcon";
import prettyBytes from "pretty-bytes";
const FileManager = ({ open, onCancel, links, uploadFile, filesToUpload }) => {
  const [fileList, setFileList] = useState([]);
  const [status, setStatus] = useState("ready");
  useEffect(
    () => {
      const currentName = form.getFieldsValue().directory
        ? form.getFieldsValue().directory + "/" + form.getFieldsValue().filename
        : form.getFieldsValue().filename;

      if (fileList.length > 0 && filesToUpload.has(currentName)) {
        setStatus(filesToUpload.get(currentName).status);
        if (filesToUpload.get(currentName).status == "done")
          setTimeout(() => {
            setFileList([]);
            setStatus("ready");
          }, 1000);
      }
    },
    [filesToUpload]
  );
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      onCancel={() => {
        onCancel();
        setFileList([]);
      }}
      title="File Upload"
      okText="Upload"
      okButtonProps={{
        disabled: fileList.length == 0,
        onClick: () =>
          uploadFile(
            links.bucket.replace(".cern.ch/", "/cern.ch/api/"),
            fileList[0], // Send only first file from the list
            form.getFieldsValue().directory
              ? form.getFieldsValue().directory +
                "/" +
                form.getFieldsValue().filename
              : form.getFieldsValue().filename,
            form
              .getFieldsValue()
              .file_tags.reduce(
                (acc, item) => acc + item.key + "=" + item.value + ";",
                ""
              )
          ),
      }}
    >
      <Upload.Dragger
        name="upload_file"
        disabled={fileList.length > 0}
        beforeUpload={file => {
          setFileList([file]);
          form.setFieldsValue({
            filename: file.name,
            directory: "",
            file_tags: [],
          });
        }}
        itemRender={(_, file) =>
          status == "done" ? (
            <Space size="middle">
              <CheckCircleTwoTone twoToneColor="#52c41a" />
              <Typography.Text>File Uploaded</Typography.Text>
            </Space>
          ) : (
            file && (
              <div
                style={{
                  padding: "10px",
                  border: "2px dashed steelblue",
                  margin: "10px 0",
                  opacity: status == "uploading" && 0.5,
                }}
              >
                <Row justify="space-between">
                  {_getIcon(file.type)}
                  <Typography.Text>
                    {file.size && prettyBytes(file.size)}
                  </Typography.Text>
                </Row>
                <Row>
                  <Form form={form}>
                    <Form.Item name="filename" label="Filename">
                      <Input />
                    </Form.Item>
                    <Form.Item name="directory" label="Upload Directory">
                      <Input />
                    </Form.Item>
                    <Form.List name="file_tags">
                      {(fields, { add, remove }) => (
                        <React.Fragment>
                          {fields.map(field => (
                            <Space
                              key={[field.fieldKey, "file_tags"]}
                              style={{ display: "flex", marginBottom: 8 }}
                              align="baseline"
                            >
                              <Form.Item
                                {...field}
                                label="Tag"
                                name={[field.name, "key"]}
                              >
                                <Input placeholder="key" />
                              </Form.Item>
                              <Form.Item
                                {...field}
                                name={[field.name, "value"]}
                              >
                                <Input placeholder="value" />
                              </Form.Item>
                              <MinusCircleOutlined
                                onClick={() => remove(field.name)}
                              />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add Tag
                            </Button>
                          </Form.Item>
                        </React.Fragment>
                      )}
                    </Form.List>
                  </Form>
                </Row>
              </div>
            )
          )
        }
        fileList={fileList}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Upload.Dragger>
    </Modal>
  );
};

FileManager.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  links: PropTypes.object,
  uploadFile: PropTypes.func,
  filesToUpload: PropTypes.object,
};

export default FileManager;
