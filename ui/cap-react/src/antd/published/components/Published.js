import { useEffect } from "react";
import PropTypes from "prop-types";
import { PUBLISHED_ITEM } from "../../routes";
import { Route, Switch } from "react-router-dom";
import DocumentTitle from "../../partials/DocumentTitle";
import PublishedPreview from "../containers/Preview";
import Error from "../../partials/Error";
import PublishedLoader from "../Loaders/Published";

const Published = ({
  error,
  match,
  getPublishedItem,
  clearPublishedState,
  loading,
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
  loading: PropTypes.bool,
};

export default Published;
