import React from "react";
import PropTypes from "prop-types";
import { Menu, Dropdown } from "antd";
import { WELCOME } from "../../../../components/routes";
import OauthPopup from "../../../../components/settings/components/OAuthPopup";
import { LoginOutlined } from "@ant-design/icons";
import LoginForm from "../LoginForm";
const { Item } = Menu;

const SimpleMenu = ({
  pathname,
  location,
  initCurrentUser,
  loginLocalUser
}) => {
  if (pathname != WELCOME) return null;

  let oauthLink =
    process.env.NODE_ENV === "development"
      ? `/oauth/login/cern?next=/`
      : `/api/oauth/login/cern?next=/`;

  return (
    <Menu title="account" theme="dark" selectable={false} mode="horizontal">
      <Dropdown
        trigger="click"
        overlay={<LoginForm loginLocalUser={loginLocalUser} />}
        size="large"
      >
        <Item key="login" icon={<LoginOutlined />}>
          Local Login
        </Item>
      </Dropdown>
      <Item key="home">
        <a href="#home">Home</a>
      </Item>
      <Item key="discover">
        <a href="#discover">What is Cap</a>
      </Item>
      <Item key="explain">
        <a href="#explain">Get Started</a>
      </Item>
      <Item key="integrations">
        <a href="#integrations">Integrations</a>
      </Item>
      <Item key="documentation">
        <a href="#documentation">Documentation</a>
      </Item>
      <OauthPopup url={oauthLink} loginCallBack={() => initCurrentUser("/")}>
        <Item key="login">Log In</Item>
      </OauthPopup>
    </Menu>
  );
};

SimpleMenu.propTypes = {
  location: PropTypes.object,
  pathname: PropTypes.string,
  initCurrentUser: PropTypes.func,
  loginLocalUser: PropTypes.func
};

export default SimpleMenu;
