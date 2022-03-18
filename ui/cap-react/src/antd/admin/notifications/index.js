import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import {
  CMS_NOTIFICATION,
  CMS_NOTIFICATION_CATEGORY,
  CMS_NOTIFICATION_EDIT
} from "../../../components/routes";
import Notifications from "./containers/Notifications";
import NotificationEdit from "./containers/NotificationEdit";

const index = () => {
  return (
    <Switch>
      <Route exact path={CMS_NOTIFICATION} component={Notifications} />
      <Route exact path={CMS_NOTIFICATION_CATEGORY} component={Notifications} />
      <Route path={CMS_NOTIFICATION_EDIT} component={NotificationEdit} />
    </Switch>
  );
};

index.propTypes = {};

export default index;
