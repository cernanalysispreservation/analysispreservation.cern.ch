import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  PUBLISHED_ITEM,
  PUBLISHED_ITEM_RUNS,
  PUBLISHED_ITEM_RUNS_CREATE
} from "../../routes";
import { Route, Switch } from "react-router-dom";
import DocumentTitle from "../../../components/partials/Title";
import PublishedPreview from "../containers/Preview";
import RunsIndex from "../../../components/published/RunsIndex";
import RerunPublished from "../../../components/published/RerunPublished";
import PublishedSidebar from "../../../components/published/components/PublishedSidebar";
import Error from "../../partials/Error";
import PublishedLoader from "../Loaders/Published";

const Published = ({
  error,
  match,
  item,
  getPublishedItem,
  clearPublishedState,
  loading
}) => {
  useEffect(() => {
    const { id } = match.params;
    getPublishedItem(id);
    return () => {
      clearPublishedState();
    };
  }, []);

  if (error && [403, 404, 500].includes(error.status))
    return <Error error={error} />;

  if (loading) {
    return <PublishedLoader />;
  }

  return (
    <DocumentTitle title={`${match.params.id} | Published`}>
      <Switch>
        <Route exact path={PUBLISHED_ITEM} component={PublishedPreview} />
        {item &&
          item.metadata &&
          item.metadata.workflows &&
          item.metadata.workflows.length > 0 && (
            <Route exact path={PUBLISHED_ITEM_RUNS} component={RunsIndex} />
          )}
        {item &&
          item.metadata &&
          item.metadata.workflows &&
          item.metadata.workflows.length > 0 && (
            <Route
              exact
              path={PUBLISHED_ITEM_RUNS_CREATE}
              component={RerunPublished}
            />
          )}
        {item &&
          item.metadata &&
          item.metadata.workflows &&
          item.metadata.workflows.length > 0 && <PublishedSidebar />}
      </Switch>
    </DocumentTitle>
  );
};

Published.propTypes = {
  error: PropTypes.object,
  match: PropTypes.object,
  item: PropTypes.object,
  getPublishedItem: PropTypes.func,
  clearPublishedState: PropTypes.func,
  loading: PropTypes.bool
};

export default Published;
