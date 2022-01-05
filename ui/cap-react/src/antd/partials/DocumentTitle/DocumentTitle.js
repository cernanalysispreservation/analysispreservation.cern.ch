import React from "react";
import PropTypes from "prop-types";
import withSideEffect from "react-side-effect";

class DocumentTitle extends React.Component {
  render() {
    if (this.props.children) {
      return React.Children.only(this.props.children);
    } else {
      return null;
    }
  }
}

DocumentTitle.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node
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
