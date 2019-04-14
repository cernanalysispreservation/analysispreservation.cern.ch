import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import JSONSchemaEditor from "../components/JSONSchemaEditor";

function mapStateToProps(state, props) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JSONSchemaEditor);
