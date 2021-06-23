import React from "react";
import { Switch, Route } from "react-router-dom";

import Notifications from "./containers/Notifications";
import NotificationWizard from "./containers/NotificationWizard";
import NewNotification from "./containers/NewNotification";

import {
  CMS_NOTIFICATION,
  CMS_NOTIFICATION_CATEGORY,
  CMS_NOTIFICATION_EDIT
} from "../routes";

const NotificationIndex = () => {
  return (
    <Switch>
      <Route
        path={CMS_NOTIFICATION_CATEGORY}
        component={NotificationWizard}
        exact
      />
      <Route exact path={CMS_NOTIFICATION} component={Notifications} />
      <Route path={CMS_NOTIFICATION_EDIT} component={NewNotification} />
    </Switch>
  );
};

export default NotificationIndex;
