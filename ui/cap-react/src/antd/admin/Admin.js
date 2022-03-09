import React, { Fragment } from "react";
import PropTypes from "prop-types";
import DocumentTitle from "../partials/DocumentTitle";
import { Switch, Route } from "react-router-dom";
import { CMS, CMS_SCHEMA_PATH } from "../../components/routes";
import AdminIndex from "./components/AdminIndex";
import AdminPanel from "./containers/AdminPanel";

const Admin = () => {
  return (
    <DocumentTitle title={"Admin Page"}>
      <Fragment>
        <Switch>
          <Route path={CMS} exact component={AdminIndex} />
          <Route path={CMS_SCHEMA_PATH} component={AdminPanel} />
        </Switch>
      </Fragment>
    </DocumentTitle>
  );
};

Admin.propTypes = {};

export default Admin;
