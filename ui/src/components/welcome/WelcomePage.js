import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  Box,
  Sidebar,
  Button,
  Heading,
  Header,
  Section,
  LoginForm,
  Anchor,
  Paragraph
} from "grommet";

import Spinning from "grommet/components/icons/Spinning";

import { loginLocalUser } from "../../actions/auth";

import LoginIcon from "grommet/components/icons/base/Login";

class WelcomePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box flex={true} direction="row">
        <Box
          flex={true}
          colorIndex="neutral-1-a"
          justify="center"
          align="center"
        >
          <Section>
            <Box flex={true}>
              <Box flex={true} wrap={true} pad="small" size="large">
                <Heading tag="h2">
                  Welcome to the CERN Analysis Preservation Portal.
                </Heading>
                <Heading tag="h3">
                  Our mission is to preserve physics analyses to facilitate
                  their future reuse
                </Heading>
                <Paragraph>
                  <Anchor path="/about">
                    Do you want to know more? Check out what the service is
                    about
                  </Anchor>
                </Paragraph>
              </Box>
            </Box>
          </Section>
        </Box>
        <Sidebar size="medium" justify="center" full={true}>
          <Box flex={true} justify="center" margin="medium">
            <Header
              pad="small"
              justify="end"
              alignContent="end"
              align="end"
              textAlign="right"
            >
              {this.props.authLoading ? <Spinning /> : null}
            </Header>
            <Box flex={true} justify="center">
              <Button
                icon={<LoginIcon />}
                label="Log in with CERN"
                href="/api/oauth/login/cern"
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
              <hr />
              {process.env.NODE_ENV === "development" ? (
                <LoginForm
                  usernameType="email"
                  defaultValues={{ username: "info@inveniosoftware.org" }}
                  onSubmit={this.props.loginLocalUser.bind(this)}
                />
              ) : null}
            </Box>
          </Box>
        </Sidebar>
      </Box>
    );
  }
}

WelcomePage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  loginLocalUser: PropTypes.func.isRequired,
  authLoading: PropTypes.bool.isRequired,
  authError: PropTypes.object
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.auth.get("isLoggedIn"),
    authLoading: state.auth.get("loading"),
    authError: state.auth.get("error")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginLocalUser: data => dispatch(loginLocalUser(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WelcomePage);
