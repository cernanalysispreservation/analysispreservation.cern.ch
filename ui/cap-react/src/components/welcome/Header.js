import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import Box from "grommet/components/Box";

import Header from "grommet/components/Header";

import LoginForm from "grommet/components/LoginForm";

import { loginLocalUser } from "../../actions/auth";

import CAPLogoDark from "../../img/cap-logo-dark.svg";

import Menu from "../partials/Menu";
import MenuItem from "../partials/MenuItem";

import MediaQuery from "react-responsive";
import { AiOutlineLogin, AiOutlineMenu } from "react-icons/ai";

class WelcomePage extends React.Component {
  constructor(props) {
    super(props);
    let {
      location: { state: { next: next = "/" } = {} }
    } = this.props.history;

    this.state = {
      showLogin: false,
      next: next,
      oauthLink: process.env.NODE_ENV === "development" ?
        `/oauth/login/cern?next=${next}` : `/api/oauth/login/cern?next=${next}`
    };
  }

  componentDidMount() {}

  onFormSubmit = formData => {
    // fetch the next from history
    formData["next"] = this.state.next;

    this.props.loginLocalUser(formData);
  };

  renderLoginPopup(oauthLink) {
    // in order to test locally, url neeeds to be ngrok_url + oauthLink
    const { title = "", width = 500, height = 450 } = this.props;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    window.open(
      oauthLink,
      title,
      `width=${width},height=${height},left=${left},top=${top}`
    );
  }

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
              <MenuItem
                title="Log in"
                background="transparent"
                href={this.state.oauthLink}
                className="menuItem"
                onClick={() =>
                  this.renderLoginPopup(this.state.oauthLink)
                }
              />
            </MediaQuery>
            <MediaQuery maxWidth={1069}>
              <MenuItem
                title="Log in"
                href={this.state.oauthLink}
                hovered
                background="transparent"
                icon={<AiOutlineLogin size={23} color="rgb(110,110,110)" />}
              />
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
  title: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

function mapStateToProps(state) {
  return {
    authLoading: state.auth.get("loading"),
    authError: state.auth.get("error")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginLocalUser: data => dispatch(loginLocalUser(data))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WelcomePage)
);
