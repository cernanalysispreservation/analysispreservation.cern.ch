import React from "react";
import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import WelcomePage from "./welcome/WelcomePage";
import IndexPage from "./index/IndexPage";

import CMSIndex from "./cms";

import HowToSearchPage from "./about/HowToSearch";
import AboutPage from "./about/AboutPage";
import PolicyPage from "./policy";
import StatusPage from "./status/StatusPage";
import noRequireAuth from "./auth/NoAuthorizationRequired";
import requireAuth from "./auth/AuthorizationRequired";

import Box from "grommet/components/Box";
import Grommet from "grommet/components/Grommet";

import { initCurrentUser } from "../actions/auth";
import { connect } from "react-redux";

import DocumentTitle from "./partials/Title";

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // const path = this.props.location.pathname;
    let {
      location: { state: { next: next = undefined } = {} }
    } = this.props.history;
    this.props.initCurrentUser(next);
  }

  render() {
    if (this.props.loadingInit) return <Box>Loading....</Box>;
    return (
      <Grommet>
        <Box flex={false} full={true}>
          <DocumentTitle title="Dashboard">
            <Switch id="main-container">
              <Route path="/login" component={noRequireAuth(WelcomePage)} />
              <Route path="/about" component={AboutPage} />
              <Route path="/policy" component={PolicyPage} />
              <Route path="/status" component={StatusPage} />
              <Route path="/cms" component={CMSIndex} />
              <Route path="/search-tips" component={HowToSearchPage} />
              <Route path="/" component={requireAuth(IndexPage)} />
              {/*
            <Route component={NotFoundPage} />
             */}
            </Switch>
          </DocumentTitle>
        </Box>
      </Grommet>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  initCurrentUser: PropTypes.func,
  loadingInit: PropTypes.bool,
  history: PropTypes.object,
  location: PropTypes.object
};

function mapStateToProps(state) {
  return {
    groups: state.auth.getIn(["currentUser", "depositGroups"]),
    loadingInit: state.auth.get("loadingInit")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initCurrentUser: next => dispatch(initCurrentUser(next))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
