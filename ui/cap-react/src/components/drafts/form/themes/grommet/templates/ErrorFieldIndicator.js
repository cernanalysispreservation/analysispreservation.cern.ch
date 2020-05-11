import React from "react";
import Box from "grommet/components/Box";
import PropTypes from "prop-types";

import { connect } from "react-redux";

const ErrorFieldIndicator = ({
  children,
  id,
  hideIndicator = false,
  tab = false,
  formErrors
}) => {
  // If there is an error that startsWith the "id", probably means that
  //  this is the parent of an erronous field
  let isCurrentErrored;
  if (Array.isArray(id)) {
    isCurrentErrored = formErrors.some(error => {
      return id.filter(ids => error.startsWith(ids)).length > 0;
    });
  } else {
    isCurrentErrored = formErrors.some(error => error.startsWith(id));
  }

  if (!isCurrentErrored || hideIndicator) return children;

  let styles = {};
  if (tab) styles["borderRight"] = "2px solid #f04b37";
  else styles["borderLeft"] = "1px solid #f04b37";

  return (
    <Box flex={!tab} style={styles}>
      {children}
    </Box>
  );
};

ErrorFieldIndicator.propTypes = {
  formErrors: PropTypes.array,
  id: PropTypes.string,
  children: PropTypes.element,
  tab: PropTypes.bool,
  hideIndicator: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    formErrors: state.draftItem.get("formErrors")
  };
}

export default connect(
  mapStateToProps,
  null
)(ErrorFieldIndicator);
