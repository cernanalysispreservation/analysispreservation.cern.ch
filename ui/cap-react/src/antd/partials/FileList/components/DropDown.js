import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dropdown, Space, Typography, Row, Menu, Col } from "antd";
import {
  CloseOutlined,
  CloudDownloadOutlined,
  DownOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import prettyBytes from "pretty-bytes";
import { Route } from "react-router-dom";
import { DRAFT_ITEM } from "../../../routes";
import EllipsisText from "../../EllipsisText";

const { Text } = Typography;

const menu = (data, infoClick, getFileVersions, deleteFile) => (
  <Menu>
    <Route
      path={DRAFT_ITEM}
      render={() => (
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
      )}
    />
    <Menu.Item key="download" icon={<CloudDownloadOutlined />}>
      <a
        href={
          data.data.links && data.data.links.self
            ? data.data.links.self
            : `/api/files/${data.data.bucket}/${data.data.key}`
        }
        download
      >
        Download
      </a>
    </Menu.Item>
    <Route
      path={DRAFT_ITEM}
      render={() => (
        <React.Fragment>
          <Menu.Divider />
          <Menu.Item
            key="delete"
            icon={<CloseOutlined />}
            onClick={() => deleteFile(data.data.links.self, data.data.key)}
            danger
          >
            Delete
          </Menu.Item>
        </React.Fragment>
      )}
    />
  </Menu>
);

const DropDownFiles = props => {
  const [isShown, setIsShown] = useState(false);

  if (!props.file) return null;

  return (
    <React.Fragment>
      <Row
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
        flex
      >
        <Col span={18} lex="auto">
          <Row
            flex={1}
            justify="space-between"
            align="center"
            style={{ width: "100%" }}
            wrap={false}
          >
            <Space>
              {props.file.icon}
              <EllipsisText
                middle
                tooltip
                length={30}
                suffixCount={10}
                type="secondary"
              >
                {props.file.name}
              </EllipsisText>
            </Space>
          </Row>
        </Col>
        <Col span={6} align="center" justify="end">
          <Row align="end">
            <Space>
              <Text
                style={{ wrap: false, textOverflow: "" }}
                type="secondary"
              >{`${prettyBytes(props.file.data.size).toUpperCase()}`}</Text>
              {isShown && (
                <Dropdown
                  trigger="click"
                  overlay={menu(
                    props.file,
                    () => props.infoClick(props.file),
                    () => props.getFileVersions(),
                    (link, path) => props.deleteFile(link, path)
                  )}
                >
                  <DownOutlined style={{ fontSize: "10px" }} />
                </Dropdown>
              )}
            </Space>
          </Row>
        </Col>
      </Row>
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
