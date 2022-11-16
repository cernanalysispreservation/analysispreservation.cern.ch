import React from "react";
import { Route, Switch } from "react-router-dom";
import {
  CMS_NOTIFICATION,
  CMS_NOTIFICATION_EDIT
} from "../../routes";
import Notifications from "./containers/Notifications";
import NotificationEdit from "./containers/NotificationEdit";

const index = () => {
  return (
    <Switch>
      <Route exact path={CMS_NOTIFICATION} component={Notifications} />
      <Route path={CMS_NOTIFICATION_EDIT} component={NotificationEdit} />
    </Switch>
  );
};

export default index;
