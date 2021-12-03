import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dropdown, Space, Modal, Typography, Tag, Row, Menu } from "antd";
import {
  CloseOutlined,
  CloudDownloadOutlined,
  DownOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import prettyBytes from "pretty-bytes";
import { Route } from "react-router-dom";
import { DRAFT_ITEM } from "../../../../components/routes";

const menu = (data, infoClick, getFileVersions, deleteFile) => (
  <Menu>
    <Menu.Item
      key="info"
      icon={<InfoCircleOutlined />}
      onClick={() => {
        infoClick();
        getFileVersions();
      }}
    >
      Info
    </Menu.Item>
    <Menu.Item key="download" icon={<CloudDownloadOutlined />}>
      <a href={data.data.links.self} download>
        Download
      </a>
    </Menu.Item>
    <Menu.Divider />
    <Route
      path={DRAFT_ITEM}
      render={() => (
        <Menu.Item
          key="delete"
          icon={<CloseOutlined />}
          onClick={() => deleteFile(data.data.links.self, data.data.key)}
          danger
        >
          Delete
        </Menu.Item>
      )}
    />
  </Menu>
);

const timeOptions = {
  day: "numeric",
  month: "long",
  year: "numeric"
};
const DropDownFiles = props => {
  const [displayFileInfo, setDisplayFileInfo] = useState(false);
  if (!props.file) return null;

  return (
    <React.Fragment>
      <Modal
        visible={displayFileInfo}
        onCancel={() => setDisplayFileInfo(false)}
        okButtonProps={{
          onClick: () => setDisplayFileInfo(false)
        }}
        title="File Info"
      >
        <Typography.Title level={5}>{props.file.name}</Typography.Title>
        <Typography.Text type="secondary">
          {props.file.data.checksum}
        </Typography.Text>
        <Space style={{ margin: "10px 0 ", flexWrap: "wrap" }}>
          {Object.entries(props.file.data.tags).map(item => (
            <Tag key={item[0] + item[1]}>
              {item[0]}={item[1]}
            </Tag>
          ))}
        </Space>

        {props.versions
          .filter(version => version.get("key") === props.file.key)
          .map(version => (
            <Row
              key={version.getIn(["links", "self"])}
              style={{
                margin: "10px 0",
                padding: "10px",
                background: "#f5f5f5"
              }}
              justify="space-between"
            >
              <Typography.Text level={5}>{props.file.name}</Typography.Text>
              {version.get("is_head") && <Tag color="green">latest</Tag>}
              <Typography.Text>
                {new Date(version.get("created")).toLocaleString(
                  "en-GB",
                  timeOptions
                )}
              </Typography.Text>
              <Typography.Text>
                {prettyBytes(parseInt(version.get("size")))}
              </Typography.Text>
              <a download href={version.getIn(["links", "self"])}>
                <CloudDownloadOutlined />
              </a>
            </Row>
          ))}
      </Modal>
      <Dropdown
        overlay={menu(
          props.file,
          () => setDisplayFileInfo(true),
          () => props.getFileVersions(),
          (link, path) => props.deleteFile(link, path)
        )}
      >
        <Space>
          {props.file.name}
          {`(${prettyBytes(props.file.data.size)})`}
          <DownOutlined />
        </Space>
      </Dropdown>
    </React.Fragment>
  );
};

DropDownFiles.propTypes = {
  file: PropTypes.object,
  versions: PropTypes.object,
  deleteFile: PropTypes.func,
  getFileVersions: PropTypes.func
};

export default DropDownFiles;
