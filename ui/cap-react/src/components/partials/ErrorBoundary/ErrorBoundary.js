import React, { Component } from "react";
import PropTypes from "prop-types";
import { Box } from "grommet";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    if (this.state.error) {
      return <Box> Something went wrong </Box>;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node
};
