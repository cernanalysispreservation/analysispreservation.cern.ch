import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import DocumentTitle from "../partials/Title";
import SchemaWizard from "./containers/SchemaWizard";
import SchemaWizardHeader from "./containers/SchemaWizardHeader";

import NotificationIndex from "./NotificationIndex";

import { CMS_EDIT, CMS_NOTIFICATION } from "../routes";

const AdminIndex = ({ location, match, history, getSchema }) => {
  useEffect(() => {
    let { schema_name, schema_version } = match.params;
    const { pathname } = location;
    schema_version =
      schema_version == "builder" || schema_version == "notifications"
        ? undefined
        : schema_version;
    // check if for some reason the path is not complete
    if (!pathname.includes("builder") && !pathname.includes("notifications"))
      schema_version
        ? history.replace(`/admin/${schema_name}/${schema_version}/builder`)
        : history.replace(`/admin/${schema_name}/builder`);

    // fetch schema
    if (schema_name) getSchema(schema_name, schema_version);
  }, []);

  return (
    <DocumentTitle
      title={
        location.pathname.includes("notifications")
          ? "Notifications"
          : "Form Builder"
      }
    >
      <React.Fragment>
        <SchemaWizardHeader />
        <Switch>
          <Route path={CMS_EDIT} component={SchemaWizard} />
          <Route path={CMS_NOTIFICATION} component={NotificationIndex} />
        </Switch>
      </React.Fragment>
    </DocumentTitle>
  );
};

AdminIndex.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object
};

export default AdminIndex;
