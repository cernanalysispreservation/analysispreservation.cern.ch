import PropTypes from "prop-types";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  BranchesOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { getSelectedMenuItem } from "../../utils/menu";

const NavMenu = ({ match, history, formErrors }) => {
  return (
    <Menu
      style={{ height: "100%" }}
      theme="dark"
      mode="inline"
      selectedKeys={getSelectedMenuItem(history.location.pathname)}
      items={[
        {
          key: "overview",
          label: <Link to={`/drafts/${match.params.draft_id}`}>Overview</Link>,
          icon: <AppstoreOutlined />,
        },
        {
          key: "edit",
          label: <Link to={`/drafts/${match.params.draft_id}/edit`}>Edit</Link>,
          icon: <TagOutlined />,
          danger: formErrors && formErrors.size > 0,
        },
        {
          key: "connect",
          label: (
            <Link to={`/drafts/${match.params.draft_id}/integrations`}>
              Connect
            </Link>
          ),
          icon: <BranchesOutlined />,
        },
        {
          key: "workflows",
          label: "Workflows",
          icon: <PlayCircleOutlined />,
          disabled: true,
        },
        {
          key: "settings",
          label: (
            <Link
              data-cy="itemNavSettings"
              to={`/drafts/${match.params.draft_id}/settings`}
            >
              Settings
            </Link>
          ),
          icon: <SettingOutlined />,
        },
      ]}
    />
  );
};

NavMenu.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  formErrors: PropTypes.object,
};

export default NavMenu;
