import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Switch, Route } from "react-router-dom";

import SearchPage from "../../components/search/SearchPage";

import Header from "../partials/Header";

import Dashboard from "../dashboard";

import DraftsItemIndex from "../../components/drafts/DraftsItemIndex";
import SettingsIndex from "../../components/settings";
import CreateIndex from "../../components/create";

import PublishedIndex from "../../components/published/PublishedIndex";
import Footer from "../../antd/partials/Footer";
import ErrorPage from "../../components/partials/ErrorPage";
import { Layout } from "antd";

import {
  HOME,
  DRAFTS,
  PUBLISHED,
  SETTINGS,
  CREATE_INDEX,
  SEARCH,
  DRAFT_ITEM
} from "../../components/routes";

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout className="__mainLayout__">
        <Layout.Header className="__mainHeader__">
          <Header />
        </Layout.Header>
        <Layout.Content style={{ overflowX: "hidden" }}>
          <Switch>
            <Route path={DRAFT_ITEM} component={DraftsItemIndex} />
            <Route exact path={HOME} component={Dashboard} />
            <Route path={SEARCH} component={SearchPage} />
            <Route exact path={DRAFTS} component={SearchPage} />
            <Route path={PUBLISHED} component={PublishedIndex} />
            <Route path={SETTINGS} component={SettingsIndex} />
            <Route path={CREATE_INDEX} component={CreateIndex} />
            <Route component={ErrorPage} />
          </Switch>
        </Layout.Content>
        <Layout.Footer>
          <Footer />
        </Layout.Footer>
      </Layout>
    );
  }
}

IndexPage.propTypes = {
  isLoggedIn: PropTypes.bool,
  history: PropTypes.object,
  match: PropTypes.object
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.auth.get("isLoggedIn")
  };
}

export default withRouter(connect(mapStateToProps)(IndexPage));
