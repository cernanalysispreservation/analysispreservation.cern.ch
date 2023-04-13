import { useState } from "react";
import PropTypes from "prop-types";
import { Dropdown, Space, Typography, Row, Col } from "antd";
import {
  CloseOutlined,
  CloudDownloadOutlined,
  DownOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import prettyBytes from "pretty-bytes";
import EllipsisText from "../../EllipsisText";

const { Text } = Typography;

const menu = (data, infoClick, getFileVersions, deleteFile) => [
  {
    key: "info",
    label: "Info",
    icon: <InfoCircleOutlined />,
    onClick: () => {
      infoClick();
      getFileVersions();
    },
  },
  {
    key: "download",
    label: (
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
    ),
    icon: <CloudDownloadOutlined />,
  },
  { type: "divider" },
  {
    key: "delete",
    label: "Delete",
    icon: <CloseOutlined />,
    onClick: () => deleteFile(data.data.links.self, data.data.key),
    danger: true,
  },
];

const DropDownFiles = ({
  file,
  onFileClick,
  infoClick,
  getFileVersions,
  deleteFile,
}) => {
  const [isShown, setIsShown] = useState(false);

  if (!file) return null;

  return (
    <>
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
            onClick={() => onFileClick && onFileClick(file)}
          >
            <Space>
              {file.icon}
              <EllipsisText
                middle
                tooltip
                length={30}
                suffixCount={10}
                type="secondary"
              >
                {file.name}
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
              >{`${prettyBytes(file.data.size).toUpperCase()}`}</Text>
              {isShown && (
                <Dropdown
                  trigger="click"
                  menu={{
                    items: menu(
                      file,
                      () => infoClick(file),
                      () => getFileVersions(),
                      (link, path) => deleteFile(link, path)
                    ),
                  }}
                >
                  <DownOutlined style={{ fontSize: "10px" }} />
                </Dropdown>
              )}
            </Space>
          </Row>
        </Col>
      </Row>
    </>
  );
};

DropDownFiles.propTypes = {
  file: PropTypes.object,
  deleteFile: PropTypes.func,
  getFileVersions: PropTypes.func,
  infoClick: PropTypes.func,
  onFileClick: PropTypes.func,
};

export default DropDownFiles;
