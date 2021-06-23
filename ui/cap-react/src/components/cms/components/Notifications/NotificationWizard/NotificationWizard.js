import React from "react";
import PropTypes from "prop-types";
import EmptyWizard from "./EmptyWizard";
import NewNotification from "./NewNotification";

const nots = [];
const NotificationWizard = props => {
  return nots.length === 0 ? <NewNotification /> : <div>wizard</div>;
};

NotificationWizard.propTypes = {};

export default NotificationWizard;
