import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Layout } from "antd";
import Header from "../containers/Header";
import { CMS, CMS_EDIT, CMS_NEW } from "../../routes";
import DocumentTitle from "../../partials/DocumentTitle";
import { Route, Switch } from "react-router-dom";
import SchemaWizard from "../containers/SchemaWizard";

const AdminPanel = ({location,  match, replacePath, schema, schemaInit, getSchema }) => {
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

  const getPageTitle = () =>
    location.pathname.includes("notifications")
      ? "Notifications"
      : "Form Builder";
        return (
    <DocumentTitle title={getPageTitle()}>
      <Layout style={{ height: "100%", padding: 0 }}>
        <Layout.Header style={{ padding: "0 10px" }}>
          <Header />
        </Layout.Header>
        <Layout.Content>
          <Switch>
            <Route path={CMS_EDIT} component={SchemaWizard} />
            {/* <Route path={CMS_NOTIFICATION} component={NotificationIndex} /> */}
          </Switch>
        </Layout.Content>
      </Layout>
    </DocumentTitle>
  );
};

AdminPanel.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  replacePath: PropTypes.func,
  schema: PropTypes.object,
  schemaInit: PropTypes.func,
  getSchema: PropTypes.func
};

export default AdminPanel;
