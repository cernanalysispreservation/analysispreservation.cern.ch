import React from "react";
import {
  NOTIFICATIONS,
  NOTIFICATIONS_CATEGORY,
  NOTIFICATIONS_CREATE,
  NOTIFICATIONS_EDIT
} from "../../../routes";
import { Switch, Route } from "react-router-dom";
import Notifications from "../../containers/Notifications";
import NotificationWizard from "../../containers/NotificationWizard";
import NewNotification from "../../containers/NewNotification";

const NotificationsIndex = () => {
  return (
    <Switch>
      <Route path={NOTIFICATIONS} exact component={Notifications} />
      <Route
        exact
        path={NOTIFICATIONS_CATEGORY}
        component={NotificationWizard}
      />
      <Route path={NOTIFICATIONS_CREATE} component={NewNotification} />
      <Route path={NOTIFICATIONS_EDIT} component={NewNotification} />
    </Switch>
  );
};

export default NotificationsIndex;
