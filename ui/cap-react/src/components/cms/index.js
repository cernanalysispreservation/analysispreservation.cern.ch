import React from "react";
import PropTypes from "prop-types";

import { Switch, Route } from "react-router-dom";

import Box from "grommet/components/Box";

import CMSIndex from "./components/CMSIndex";
import SchemaWizard from "./containers/SchemaWizard";

import Notifications from "./containers/Notifications";
import NotificationWizard from "./containers/NotificationWizard";
import NewNotification from "./containers/NewNotification";

import DocumentTitle from "../partials/Title";
import {
  CMS,
  CMS_EDIT,
  CMS_NOTIFICATION,
  CMS_NOTIFICATION_CATEGORY,
  CMS_NOTIFICATION_EDIT,
  CMS_NOTIFICATION_CREATE
} from "../routes";

class IndexPage extends React.Component {
  render() {
    return (
      <Box flex={true}>
        <DocumentTitle title="Form Builder">
          <Switch>
            <Route exact path={CMS} component={CMSIndex} />
            <Route path={CMS_EDIT} component={SchemaWizard} />
            <Route path={CMS_NOTIFICATION} exact component={Notifications} />
            <Route
              exact
              path={CMS_NOTIFICATION_CATEGORY}
              component={NotificationWizard}
            />
            <Route path={CMS_NOTIFICATION_CREATE} component={NewNotification} />
            <Route path={CMS_NOTIFICATION_EDIT} component={NewNotification} />
          </Switch>
        </DocumentTitle>
      </Box>
    );
  }
}

IndexPage.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object
};

export default IndexPage;
