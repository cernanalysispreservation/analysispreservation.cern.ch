import React from "react";
import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import "./App.less";
import WelcomePage from "../components/welcome/WelcomePage";
import IndexPage from "../components/index/IndexPage";

import HowToSearchPage from "../components/about/HowToSearch";
import AboutPage from "../components/about/AboutPage";
import PolicyPage from "../components/policy";
// import StatusPage from "./status/StatusPage";
import noRequireAuth from "../components/auth/NoAuthorizationRequired";
import requireAuth from "../components/auth/AuthorizationRequired";

import { initCurrentUser } from "../actions/auth";
import { connect } from "react-redux";

import DocumentTitle from "../components/partials/Title";

import Loadable from "react-loadable";
import {
  HOME,
  WELCOME,
  ABOUT,
  POLICY,
  CMS,
  SEARCH_TIPS
} from "../components/routes";
import Loading from "../components/routes/Loading";

const CMSIndex = Loadable({
  loader: () => import("../components/cms"),
  loading: Loading,
  delay: 300
});

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
    if (this.props.loadingInit) return <div>Loading....</div>;
    return (
      <DocumentTitle title="Dashboard">
        <Switch id="main-container">
          <Route path={WELCOME} component={noRequireAuth(WelcomePage)} />
          <Route path={ABOUT} component={AboutPage} />
          <Route path={POLICY} component={PolicyPage} />
          {/* <Route path={STATUS} component={StatusPage} /> */}
          <Route path={CMS} component={CMSIndex} />
          <Route path={SEARCH_TIPS} component={HowToSearchPage} />
          <Route path={HOME} component={requireAuth(IndexPage)} />
          {/*
            <Route component={NotFoundPage} />
             */}
        </Switch>
      </DocumentTitle>
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
