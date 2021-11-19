import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import "./App.less";
import WelcomePage from "./welcome";
import IndexPage from "./index/IndexPage";

import HowToSearchPage from "../components/about/HowToSearch";
import AboutPage from "./about";
import PolicyPage from "./policy";
// import StatusPage from "./status/StatusPage";
import noRequireAuth from "../components/auth/NoAuthorizationRequired";
import requireAuth from "../components/auth/AuthorizationRequired";

import Header from "./partials/Header";
import Footer from "./partials/Footer";

import { initCurrentUser } from "../actions/auth";
import { connect } from "react-redux";

import DocumentTitle from "../components/partials/Title";
import { Layout } from "antd";

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

const App = ({ initCurrentUser, loadingInit, history }) => {
  useEffect(() => {
    let {
      location: { state: { next: next = undefined } = {} }
    } = history;
    initCurrentUser(next);
  }, []);

  if (loadingInit) return <div>Loading....</div>;
  return (
    <DocumentTitle title="Dashboard">
      <Layout className="__mainLayout__">
        <Layout.Header className="__mainHeader__">
          <Header />
        </Layout.Header>
        <Layout.Content style={{ overflowX: "hidden" }}>
          <Switch id="main-container">
            <Route path={WELCOME} component={noRequireAuth(WelcomePage)} />
            <Route path={ABOUT} component={AboutPage} />
            <Route path={POLICY} component={PolicyPage} />
            <Route path={CMS} component={CMSIndex} />
            <Route path={SEARCH_TIPS} component={HowToSearchPage} />
            <Route path={HOME} component={requireAuth(IndexPage)} />
          </Switch>
        </Layout.Content>
        <Layout.Footer>
          <Footer />
        </Layout.Footer>
      </Layout>
    </DocumentTitle>
  );
};

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
