import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import DocumentTitle from "../partials/Title";
import SchemaWizard from "./containers/SchemaWizard";
import SchemaWizardHeader from "./containers/SchemaWizardHeader";

import NotificationIndex from "./NotificationIndex";

import { CMS, CMS_EDIT, CMS_NOTIFICATION, CMS_NEW } from "../routes";

const AdminIndex = ({
  location,
  match,
  getSchema,
  replacePath,
  schema,
  schemaInit
}) => {
  useEffect(() => {
    let { schema_name, schema_version } = match.params;
    const { pathname } = location;

    // check whether the user has provided specific schema version
    schema_version = ["builder", "notifications"].includes(schema_version)
      ? undefined
      : schema_version;

    // check if for some reason the path is not complete
    // mostly due to previews path structire
    if (!pathname.includes("builder") && !pathname.includes("notifications"))
      schema_version
        ? replacePath(`${CMS}/${schema_name}/${schema_version}/builder`)
        : replacePath(`${CMS}/${schema_name}/builder`);

    // fetch schema
    // in order to cover all the potential situations creating from the already exist schemas
    // and create a new one from scratch
    if (schema_name) {
      pathname.startsWith(CMS_NEW)
        ? schema.size == 0 && schemaInit()
        : getSchema(schema_name, schema_version);
    }
  }, []);

  const getPageTitle = () => {
    return location.pathname.includes("notifications")
      ? "Notifications"
      : "Form Builder";
  };

  return (
    <DocumentTitle title={getPageTitle()}>
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
  match: PropTypes.object,
  getSchema: PropTypes.func,
  replacePath: PropTypes.func,
  schemaInit: PropTypes.func,
  schema: PropTypes.object
};

export default AdminIndex;
