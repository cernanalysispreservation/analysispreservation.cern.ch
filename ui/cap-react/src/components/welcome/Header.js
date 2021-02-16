import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import Box from "grommet/components/Box";

import Header from "grommet/components/Header";

import LoginForm from "grommet/components/LoginForm";

import { loginLocalUser, initCurrentUser } from "../../actions/auth";

import CAPLogoDark from "../../img/cap-logo-dark.svg";

import Menu from "../partials/Menu";
import MenuItem from "../partials/MenuItem";

import MediaQuery from "react-responsive";
import { AiOutlineLogin, AiOutlineMenu } from "react-icons/ai";
import OauthPopup from "../settings/components/OAuthPopup";

class WelcomePage extends React.Component {
  constructor(props) {
    super(props);
    let {
      location: { state: { next: next = "/" } = {} }
    } = this.props.history;

    this.state = {
      showLogin: false,
      next: next,
      oauthLink:
        process.env.NODE_ENV === "development"
          ? `/oauth/login/cern?next=${next}`
          : `/api/oauth/login/cern?next=${next}`
    };
  }

  loginCallBack = next => {
    this.props.initCurrentUser(next);
  };

  onFormSubmit = formData => {
    // fetch the next from history
    formData["next"] = this.state.next;

    this.props.loginLocalUser(formData);
  };

  renderOAuthConnectPopup = () => {
    return (
      <OauthPopup url={this.state.oauthLink} loginCallBack={this.loginCallBack}>
        <div>
          <MenuItem
            title="Log in"
            background="transparent"
            className="menuItem"
          />
        </div>
      </OauthPopup>
    );
  };
  render() {
    return (
      <Header
        pad={{ vertical: "none", horizontal: "small" }}
        size="small"
        fixed
      >
        <Box
          flex="grow"
          direction="row"
          justify="between"
          align="center"
          responsive={false}
        >
          <Box
            flex={true}
            direction="row"
            wrap={false}
            responsive={false}
            onClick={() => this.props.scrollToRef(this.props.nav.index.ref)}
          >
            <div style={{ padding: "10px 0" }}>
              <CAPLogoDark height="32px" />
            </div>
          </Box>
          <Box direction="row" align="center" responsive={false}>
            <MediaQuery minWidth={1070}>
              {Object.keys(this.props.nav).map((key, index) => (
                <Box key={index}>
                  <MenuItem
                    title={this.props.nav[key].title}
                    className="menuItem"
                    background="transparent"
                    href="#"
                    onClick={() =>
                      this.props.scrollToRef(this.props.nav[key].ref)
                    }
                  />
                </Box>
              ))}
              {this.renderOAuthConnectPopup()}
            </MediaQuery>
            <MediaQuery maxWidth={1069}>
              {this.renderOAuthConnectPopup()}
              <Menu top={55} right={0} icon={<AiOutlineMenu size={23} />}>
                {Object.keys(this.props.nav).map((key, index) => (
                  <Box key={index}>
                    <MenuItem
                      title={this.props.nav[key].title}
                      className="menuItem"
                      href="#"
                      hovered
                      separator
                      icon={this.props.nav[key].icon}
                      onClick={() =>
                        this.props.scrollToRef(this.props.nav[key].ref)
                      }
                    />
                  </Box>
                ))}
              </Menu>
            </MediaQuery>
            {process.env.NODE_ENV === "development" ? (
              <Box margin={{ left: "small" }}>
                <Menu
                  background="#f5f5f5"
                  top={55}
                  right={0}
                  icon={<AiOutlineLogin size={23} />}
                  dataCypress="localLogin"
                >
                  <LoginForm
                    usernameType="email"
                    defaultValues={{ username: "info@inveniosoftware.org" }}
                    onSubmit={this.onFormSubmit}
                  />
                  {this.props.authError ? (
                    <Box
                      colorIndex="critical"
                      margin={{ top: "small" }}
                      pad="small"
                    >
                      {this.props.authError}
                    </Box>
                  ) : null}
                </Menu>
              </Box>
            ) : null}
          </Box>
        </Box>
      </Header>
    );
  }
}

WelcomePage.propTypes = {
  loginLocalUser: PropTypes.func.isRequired,
  authLoading: PropTypes.bool.isRequired,
  authError: PropTypes.object,
  history: PropTypes.object,
  nav: PropTypes.object,
  scrollToRef: PropTypes.func,
  initCurrentUser: PropTypes.func
};

function mapStateToProps(state) {
  return {
    authLoading: state.auth.get("loading"),
    authError: state.auth.get("error")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginLocalUser: data => dispatch(loginLocalUser(data)),
    initCurrentUser: next => dispatch(initCurrentUser(next))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WelcomePage)
);
