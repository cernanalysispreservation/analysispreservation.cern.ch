import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
  Box,
  Sidebar,
  Button,
  Heading,
  Header,
  Section,
  LoginForm
} from 'grommet';

import Spinning from 'grommet/components/icons/Spinning';

import {loginLocalUser} from '../../actions/auth';

import LoginIcon from 'grommet/components/icons/base/Login';

class WelcomePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box flex={true} direction="row">
          <Box flex={true} colorIndex="neutral-1-a" justify="center" align="center">
            <Section>
              <Box size="large">
                <Heading tag="h2">
                  Welcome to the CERN
                  Analysis Preservation Portal.
                </Heading>
                <Heading tag="h3">
                  Our mission is to preserve the analyses
                  across all CERN experiments for years
                  to come...
                </Heading>
              </Box>
            </Section>
          </Box>
          <Sidebar size="medium" justify="center" full={true}>
            <Box flex={true} justify="center" margin="medium">
                <Header pad="small" justify="end" alignContent="end" align="end" textAlign="right">
                  { this.props.authLoading ? <Spinning /> :  null }
                </Header>
              <Box flex={true} justify="center">
                <Button
                  icon={<LoginIcon/>}
                  label="Log in with CERN"
                  href="/api/oauth/login/cern"
                />
                <hr/>
                {
                  process.env.NODE_ENV === 'development' ?
                  <LoginForm onSubmit={this.props.loginLocalUser} /> : null
                }
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
  authLoading: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.auth.get('isLoggedIn'),
    authLoading: state.auth.get('loading'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginLocalUser: () => dispatch(loginLocalUser())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WelcomePage);
