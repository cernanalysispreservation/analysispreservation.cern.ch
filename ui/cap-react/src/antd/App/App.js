import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import "./App.less";
import WelcomePage from "../welcome";
import IndexPage from "../index/IndexPage";

import AboutPage from "../about";
import PolicyPage from "../policy";

import noRequireAuth from "../../components/auth/NoAuthorizationRequired";
import requireAuth from "../../components/auth/AuthorizationRequired";

import Header from "../partials/Header";
import Footer from "../partials/Footer";

import DocumentTitle from "../partials/DocumentTitle";
import { Layout } from "antd";

import Loadable from "react-loadable";
import { HOME, WELCOME, ABOUT, POLICY, CMS } from "../../components/routes";
import Loading from "../../components/routes/Loading";

const CMSIndex = Loadable({
  loader: () => import("../../components/cms"),
  loading: Loading,
  delay: 300
});

const App = ({ initCurrentUser, loadingInit, history }) => {
  useEffect(() => {
    initCurrentUser(history.location.state);
  }, []);

  if (loadingInit) return <div>Loading....</div>;
  return (
    <DocumentTitle title="Dashboard">
      <Layout className="__mainLayout__">
        <Layout.Header className="__mainHeader__">
          <Header />
        </Layout.Header>
        <Layout.Content className="__mainContent__">
          <Switch>
            <Route path={WELCOME} component={noRequireAuth(WelcomePage)} />
            <Route path={ABOUT} component={AboutPage} />
            <Route path={POLICY} component={PolicyPage} />
            <Route path={CMS} component={CMSIndex} />
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
  initCurrentUser: PropTypes.func,
  loadingInit: PropTypes.bool,
  history: PropTypes.object
};

export default App;
