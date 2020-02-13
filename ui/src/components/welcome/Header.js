import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Menu from "grommet/components/Menu";
import Label from "grommet/components/Label";

import Header from "grommet/components/Header";

import LoginForm from "grommet/components/LoginForm";

import { loginLocalUser } from "../../actions/auth";
import LogIcon from "grommet/components/icons/base/Login";

import CAPLogoDark from "../../img/cap-logo-dark.svg";

class WelcomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: false
    };
  }

  onFormSubmit = formData => {
    let {
      location: { state: { next: next = "/" } = {} }
    } = this.props.history;
    formData["next"] = next;

    this.props.loginLocalUser(formData);
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
            <Menu
              dropAlign={{ top: "bottom" }}
              size="small"
              direction="row"
              align="center"
              pad={{ horizontal: "medium" }}
            >
              {Object.keys(this.props.nav).map(key => (
                <Box
                  onClick={() =>
                    this.props.scrollToRef(this.props.nav[key].ref)
                  }
                >
                  <Label>{this.props.nav[key].title}</Label>
                </Box>
              ))}
            </Menu>
            {process.env.NODE_ENV === "development" ? (
              <Menu
                dropAlign={{ top: "bottom" }}
                icon={<LogIcon />}
                size="small"
                closeOnClick={false}
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
            ) : null}
            <Menu
              dropAlign={{ top: "bottom" }}
              size="small"
              direction="row"
              align="center"
              pad={{ horizontal: "medium" }}
            >
              <Anchor href="/api/oauth/login/cern">
                <Label>Log in</Label>
              </Anchor>
            </Menu>
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
  history: PropTypes.object
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
