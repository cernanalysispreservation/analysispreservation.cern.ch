import PropTypes from "prop-types";
import { Menu, Dropdown, Button } from "antd";
import { WELCOME } from "../../../routes";
import OauthPopup from "../../OAuthPopUp";
import { LoginOutlined } from "@ant-design/icons";
import LoginForm from "../LoginForm";
import { useState } from "react";

const SimpleMenu = ({
  initCurrentUser,
  loginLocalUser,
  location = { state: { next: "/" } },
}) => {
  if (location.pathname != WELCOME) return null;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  let oauthLink =
    process.env.NODE_ENV === "development"
      ? `/oauth/login/cern?next=/`
      : `/api/oauth/login/cern?next=/`;

  const menuItems = [
    { label: <a href="#home">Home</a>, key: "home" },
    { label: <a href="#discover">What is Cap</a>, key: "discover" },
    { label: <a href="#explain">Get Started</a>, key: "explain" },
    {
      label: <a href="#integrations">Integrations</a>,
      key: "integrations",
    },
    {
      label: <a href="#documentation">Documentation</a>,
      key: "documentation",
    },
    {
      label: (
        <OauthPopup
          url={oauthLink}
          loginCallBack={() => initCurrentUser(location.state.next)}
        >
          <Button type="primary">Log In</Button>
        </OauthPopup>
      ),
      key: "login",
    },
  ];

  (process.env.NODE_ENV == "development" || process.env.ENABLE_E2E) &&
    menuItems.unshift({
      label: (
        <Dropdown
          menu={{
            items: [
              {
                label: <LoginForm loginLocalUser={loginLocalUser} />,
                key: "localLoginForm",
              },
            ],
          }}
          open={dropdownOpen}
          onOpenChange={x => {
            console.log(x);
            setDropdownOpen(x);
          }}
        >
          <div>
            <LoginOutlined /> Local login
          </div>
        </Dropdown>
      ),
      key: "locallogin",
    });

  return (
    <Menu theme="dark" selectable={false} mode="horizontal" items={menuItems} />
  );
};

SimpleMenu.propTypes = {
  location: PropTypes.object,
  initCurrentUser: PropTypes.func,
  loginLocalUser: PropTypes.func,
};

export default SimpleMenu;
