import React from "react";
import PropTypes from "prop-types";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  BranchesOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  TagOutlined
} from "@ant-design/icons";
import { getSelectedMenuItem } from "../../utils/menu";

const NavMenu = ({ match, history, formErrors }) => {
  return (
    <Menu
      style={{ height: "100%" }}
      theme="dark"
      mode="inline"
      selectedKeys={getSelectedMenuItem(history.location.pathname)}
    >
      <Menu.Item key="overview" icon={<AppstoreOutlined />}>
        <Link to={`/drafts/${match.params.draft_id}`}>Overview</Link>
      </Menu.Item>
      <Menu.Item
        key="edit"
        icon={<TagOutlined />}
        danger={formErrors && formErrors.size > 0}
      >
        <Link to={`/drafts/${match.params.draft_id}/edit`}>Edit</Link>
      </Menu.Item>
      <Menu.Item key="connect" icon={<BranchesOutlined />}>
        <Link to={`/drafts/${match.params.draft_id}/integrations`}>
          Connect
        </Link>
      </Menu.Item>
      <Menu.Item key="workflows" icon={<PlayCircleOutlined />} disabled>
        Workflows
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link
          data-cy="itemNavSettings"
          to={`/drafts/${match.params.draft_id}/settings`}
        >
          Settings
        </Link>
      </Menu.Item>
    </Menu>
  );
};

NavMenu.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  formErrors: PropTypes.object
};

export default NavMenu;
