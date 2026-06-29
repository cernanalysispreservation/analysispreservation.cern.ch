import PropTypes from "prop-types";
import { Menu, Popover, Button } from "antd";
import { WELCOME } from "../../../routes";
import { LoginOutlined } from "@ant-design/icons";
import LoginForm from "../LoginForm";
import { useState } from "react";
import { getConfigFor } from "../../../../config";

const SimpleMenu = ({
  loginLocalUser,
  location = { state: { next: "/" } },
}) => {
  if (location.pathname != WELCOME) return null;

  const [popoverOpen, setPopoverOpen] = useState(false);

  let oauthLink =
    process.env.NODE_ENV === "development"
      ? `/oauth/login/cern_openid?next=/`
      : `/api/oauth/login/cern_openid?next=/`;

  const menuItems = [
    { key: "home", label: <a href="#home">Home</a> },
    { key: "discover", label: <a href="#discover">What is Cap</a> },
    { key: "explain", label: <a href="#explain">Get Started</a> },
    { key: "integrations", label: <a href="#integrations">Integrations</a> },
    { key: "documentation", label: <a href="#documentation">Documentation</a> },
    {
      key: "login",
      label: <Button type="primary" href={oauthLink}>Login</Button>
    },
  ];

  (process.env.NODE_ENV == "development" || getConfigFor("ENABLE_E2E")) &&
    menuItems.unshift({
      key: "localLogin",
      label: (
        <Popover
          content={<LoginForm loginLocalUser={loginLocalUser} />}
          trigger="click"
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
          placement="bottomLeft"
          styles={{ body: { padding: 0 } }}
        >
          <div data-cy="localLogin">
            <LoginOutlined /> Local login
          </div>
        </Popover>
      ),
    });

  return (
    <Menu theme="dark" selectable={false} mode="horizontal" items={menuItems} />
  );
};

SimpleMenu.propTypes = {
  location: PropTypes.object,
  loginLocalUser: PropTypes.func,
};

export default SimpleMenu;
