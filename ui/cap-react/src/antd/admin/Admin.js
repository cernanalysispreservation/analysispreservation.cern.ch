import DocumentTitle from "../partials/DocumentTitle";
import { Switch, Route } from "react-router-dom";
import { CMS, CMS_NEW, CMS_EDITOR_PATH, CMS_SCHEMA_PATH } from "../routes";
import AdminIndex from "./components/AdminIndex";
import AdminPanel from "./containers/AdminPanel";
import SchemasPage from "../schemas";

const Admin = () => {
  return (
    <DocumentTitle title={"Admin Page"}>
      <Switch>
        <Route path={CMS_SCHEMA_PATH} component={SchemasPage} />
        <Route path={[CMS_EDITOR_PATH, CMS_NEW]} component={AdminPanel} />
        <Route path={CMS} component={AdminIndex} />
      </Switch>
    </DocumentTitle>
  );
};

export default Admin;
