import React from "react";
import PropTypes from "prop-types";
import { Menu, Dropdown, Button } from "antd";
import { WELCOME } from "../../../../components/routes";
import OauthPopup from "../../../../components/settings/components/OAuthPopup";
import { LoginOutlined } from "@ant-design/icons";
import LoginForm from "../LoginForm";
const { Item } = Menu;

const SimpleMenu = ({
  initCurrentUser,
  loginLocalUser,
  location = { state: { next: "/" } }
}) => {
  if (location.pathname != WELCOME) return null;

  let oauthLink =
    process.env.NODE_ENV === "development"
      ? `/oauth/login/cern?next=/`
      : `/api/oauth/login/cern?next=/`;

  return (
    <Menu theme="dark" selectable={false} mode="horizontal">
      {(process.env.NODE_ENV === "development" || process.env.ENABLE_E2E) && (
        <Dropdown
          trigger="click"
          overlay={<LoginForm loginLocalUser={loginLocalUser} />}
          size="large"
        >
          <Item key="locallogin" icon={<LoginOutlined />} data-cy="localLogin">
            Local Login
          </Item>
        </Dropdown>
      )}
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
      <Item key="login">
        <OauthPopup
          url={oauthLink}
          loginCallBack={() => initCurrentUser(location.state.next)}
        >
          <Button type="primary">Log In</Button>
        </OauthPopup>
      </Item>
    </Menu>
  );
};

SimpleMenu.propTypes = {
  location: PropTypes.object,
  initCurrentUser: PropTypes.func,
  loginLocalUser: PropTypes.func
};

export default SimpleMenu;
