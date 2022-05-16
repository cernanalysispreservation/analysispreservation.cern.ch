import React from "react";
import PropTypes from "prop-types";
import { DRAFT_ITEM } from "../../../routes";
import { Menu } from "antd";
import {
  CloseOutlined,
  CloudDownloadOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { Route } from "react-router-dom";
const DropDownMenu = ({ data, infoClick, getFileVersions, deleteFile }) => {
  return (
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
};

DropDownMenu.propTypes = {
  data: PropTypes.object,
  infoClick: PropTypes.func,
  getFileVersions: PropTypes.func,
  deleteFile: PropTypes.func
};

export default DropDownMenu;
