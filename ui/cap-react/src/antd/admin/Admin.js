import DocumentTitle from "../partials/DocumentTitle";
import { Switch, Route } from "react-router-dom";
import { CMS, CMS_NEW, CMS_SCHEMA_PATH } from "../routes";
import AdminIndex from "./components/AdminIndex";
import AdminPanel from "./containers/AdminPanel";

const Admin = () => {
  return (
    <DocumentTitle title={"Admin Page"}>
      <Switch>
        <Route path={CMS} exact component={AdminIndex} />
        <Route path={[CMS_SCHEMA_PATH, CMS_NEW]} component={AdminPanel} />
      </Switch>
    </DocumentTitle>
  );
};

export default Admin;
