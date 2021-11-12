import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";

export default ComposedComponent => {
  class Authentication extends Component {
    constructor(props) {
      super(props);
      if (!props.isLoggedIn) {
        props.history.push({
          pathname: "/login",
          from: props.match.path,
          search: `?next=${props.history.location.pathname}`,
          state: { next: props.history.location.pathname }
        });
      }
    }

    componentDidUpdate(nextProps) {
      if (!nextProps.isLoggedIn) {
        const path = `/login?next=${nextProps.history.location.pathname}`;
        this.props.history.push(path);
      }
    }

    PropTypes = {
      router: PropTypes.object
    };

    render() {
      if (!this.props.isLoggedIn) return null;
      let cc = <ComposedComponent {...this.props} />;

      return cc;
    }
  }

  Authentication.propTypes = {
    isLoggedIn: PropTypes.bool,
    history: PropTypes.object,
    match: PropTypes.object
  };

  function mapStateToProps(state) {
    return { isLoggedIn: state.auth.get("isLoggedIn") };
  }

  return connect(mapStateToProps)(Authentication);
};
