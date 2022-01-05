import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  Space,
  Modal,
  Typography,
  Tag,
  Table,
  Row,
  Menu,
  Col
} from "antd";
import {
  CloseOutlined,
  CloudDownloadOutlined,
  DownOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import prettyBytes from "pretty-bytes";
import { Route } from "react-router-dom";
import { DRAFT_ITEM } from "../../../../components/routes";
import TimeAgo from "react-timeago";

import moment from "moment";
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

const timeOptions = {
  day: "numeric",
  month: "long",
  year: "numeric"
};

const columns = [
  {
    dataIndex: "checksum",
    key: "checksum",
    render: text => <a>{text}</a>
  },
  {
    dataIndex: "head",
    key: "head",
    render: is_head => is_head && <Tag color="green">latest</Tag>
  },
  {
    dataIndex: "created",
    key: "created",
    render: created => {
      let nowTime = moment();
      let createdTime = moment(new Date(created));
      let createdPlusExtraTime = createdTime.add(3, "h");

      return createdPlusExtraTime.diff(nowTime) < 0 ? (
        new Date(created).toLocaleString("en-GB", timeOptions)
      ) : (
        <TimeAgo date={created} minPeriod="60" />
      );
    }
  },
  {
    dataIndex: "size",
    key: "size",
    width: "60px"
  },
  {
    dataIndex: "link",
    key: "link",
    width: "32px",
    render: link => (
      <a download href={link}>
        <CloudDownloadOutlined />
      </a>
    )
  }
];
const DropDownFiles = props => {
  const [displayFileInfo, setDisplayFileInfo] = useState(false);
  const [isShown, setIsShown] = useState(false);

  if (!props.file) return null;

  let _versions = props.versions
    .filter(version => version.get("key") === props.file.data.key)
    .map(i => ({
      checksum: i.get("checksum"),
      created: i.get("created"),
      head: i.get("is_head"),
      size: prettyBytes(i.get("size")).toUpperCase(),
      link: i.getIn(["links", "self"])
    }))
    .toJS();

  return (
    <React.Fragment>
      <Modal
        visible={displayFileInfo}
        width={640}
        onCancel={() => setDisplayFileInfo(false)}
        okButtonProps={{
          onClick: () => setDisplayFileInfo(false)
        }}
        title="File Info"
      >
        <Typography.Title level={5}>{props.file.name}</Typography.Title>
        <Space style={{ margin: "10px 0 ", flexWrap: "wrap" }}>
          {props.file.data &&
            props.file.data.tags &&
            Object.entries(props.file.data.tags).map(item => (
              <Tag key={item[0] + item[1]}>
                {item[0]}={item[1]}
              </Tag>
            ))}
        </Space>
        <Table
          showHeader={false}
          size="small"
          dataSource={_versions}
          columns={columns}
        />
      </Modal>
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
                    () => setDisplayFileInfo(true),
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
