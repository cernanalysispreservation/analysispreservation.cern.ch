import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Header from "../containers/Header";
import { CMS_NEW } from "../../routes";
import DocumentTitle from "../../partials/DocumentTitle";
import SchemaWizard from "../containers/SchemaWizard";
import Notifications from "../notifications/containers/Notifications";
import { Layout } from "antd";

const AdminPanel = ({ location, match, schema, schemaInit, getSchema }) => {
  useEffect(() => {
    let { schema_name, schema_version } = match.params;
    const { pathname } = location;

    // fetch schema
    // in order to cover all the potential situations creating from the already exist schemas
    // and create a new one from scratch
    if (schema_name) {
      pathname.startsWith(CMS_NEW)
        ? schema.size == 0 && schemaInit()
        : getSchema(schema_name, schema_version);
    }
  }, []);

  const [display, setDisplay] = useState("builder");

  const getPageTitle = () =>
    location.pathname.includes("notifications")
      ? "Notifications"
      : "Form Builder";
  return (
    <DocumentTitle title={getPageTitle()}>
      <Layout style={{ height: "100%", padding: 0 }}>
        <Header display={display} setDisplay={setDisplay} />
        <Layout.Content>
          {display === "notifications" ? <Notifications /> : <SchemaWizard />}
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
  getSchema: PropTypes.func,
};

export default AdminPanel;
