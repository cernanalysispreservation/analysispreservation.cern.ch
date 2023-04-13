import { Route } from "react-router-dom";
import { PUBLISHED_ITEM } from "../../routes";
import Published from "../containers/Published";

const PublishedIndex = () => {
  return <Route path={PUBLISHED_ITEM} component={Published} />;
};

PublishedIndex.propTypes = {};

export default PublishedIndex;
