import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {withRouter} from 'react-router';
import PropTypes from 'prop-types';

import WelcomePage from './welcome/WelcomePage';
import AboutPage from './about/AboutPage';
import HowToSearchPage from './about/HowToSearch';
import IndexPage from './index/IndexPage';
import NotFoundPage from './NotFoundPage';

import noRequireAuth from './auth/NoAuthorizationRequired';

import GrommetApp from 'grommet/components/App';

import {initCurrentUser} from '../actions/auth';
import {connect} from 'react-redux';

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.initCurrentUser();
  }

  render() {
    return (
      <GrommetApp centered={false} id="app-main">
        <div id="main-container">
          <Switch id="main-container">
            <Route path="/login" component={noRequireAuth(WelcomePage)} />
            <Route path="/about" component={AboutPage} />
            <Route path="/howto" component={HowToSearchPage} />
            <Route path="/" component={IndexPage} />
            <IndexPage />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </GrommetApp>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  initCurrentUser: PropTypes.func
};

function mapStateToProps(state) {
  return {
    groups: state.auth.getIn(['currentUser', 'depositGroups'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initCurrentUser: () => dispatch(initCurrentUser()),
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));
