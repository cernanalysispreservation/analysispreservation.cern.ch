import AboutPage from "../about";
import requireAuth from "../auth/AuthorizationRequired";
import noRequireAuth from "../auth/NoAuthorizationRequired";
import useTrackPageViews from "../hooks/useTrackPageViews";
import IndexPage from "../index/IndexPage";
import DocumentTitle from "../partials/DocumentTitle";
import Footer from "../partials/Footer";
import Header from "../partials/Header";
import PolicyPage from "../policy";
import { HOME, WELCOME, ABOUT, POLICY, CMS, SCHEMAS } from "../routes";
import Loading from "../routes/Loading";
import SchemasPage from "../schemas";
import ErrorPage from "../utils/ErrorPage";
import WelcomePage from "../welcome";
import "./App.less";
import * as Sentry from "@sentry/react";
import { Layout, Row, Spin } from "antd";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import Loadable from "react-loadable";
import { Switch, Route } from "react-router-dom";

const CMSIndex = Loadable({
  loader: () => import("../admin"),
  loading: Loading,
  delay: 300,
});

const App = ({ initCurrentUser, loadingInit, history, roles }) => {
  useEffect(() => {
    initCurrentUser(history.location.state);
  }, []);

  useTrackPageViews(history.location.pathname);

  const isAdmin =
    roles && (roles.get("isSuperUser") || roles.get("schemaAdmin").size > 0);

  if (loadingInit)
    return (
      <Layout className="__mainLayout__">
        <Row style={{ height: "100%" }} align="middle" justify="center">
          <Spin size="large" />
        </Row>
      </Layout>
    );

  return (
    <DocumentTitle title="Dashboard">
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack }) => (
          <ErrorPage error={error} componentStack={componentStack} />
        )}
      >
        <Layout className="__mainLayout__">
          <Layout.Header className="__mainHeader__">
            <Header />
          </Layout.Header>
          <Layout.Content className="__mainContent__">
            <Switch>
              <Route path={WELCOME} component={noRequireAuth(WelcomePage)} />
              <Route path={ABOUT} component={AboutPage} />
              <Route path={POLICY} component={PolicyPage} />
              {isAdmin && <Route path={CMS} component={CMSIndex} />}
              <Route path={SCHEMAS} component={SchemasPage} />
              <Route path={HOME} component={requireAuth(IndexPage)} />
            </Switch>
          </Layout.Content>
          <Layout.Footer>
            <Footer />
          </Layout.Footer>
        </Layout>
      </Sentry.ErrorBoundary>
    </DocumentTitle>
  );
};

App.propTypes = {
  initCurrentUser: PropTypes.func,
  loadingInit: PropTypes.bool,
  history: PropTypes.object,
  roles: PropTypes.object,
};

export default App;
