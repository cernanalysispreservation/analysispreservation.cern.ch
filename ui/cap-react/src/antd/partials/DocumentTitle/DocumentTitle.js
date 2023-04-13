import { Children } from "react";
import PropTypes from "prop-types";
import withSideEffect from "react-side-effect";

const DocumentTitle = ({ children }) => {
  if (children) {
    return Children.only(children);
  } else {
    return null;
  }
};

DocumentTitle.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

function reducePropsToState(propsList) {
  let innermostProps = propsList[propsList.length - 1];
  if (innermostProps) {
    return innermostProps.title;
  }
}

function handleStateChangeOnClient(title) {
  let nextTitle = title || "";
  if (nextTitle !== document.title) {
    document.title = `${nextTitle} | CERN Analysis Preservation`;
  }
}

export default withSideEffect(reducePropsToState, handleStateChangeOnClient)(
  DocumentTitle
);
