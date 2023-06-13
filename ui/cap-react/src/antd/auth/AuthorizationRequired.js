import { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

export default ComposedComponent => {
  class Authentication extends Component {
    render() {
      if (!this.props.isLoggedIn) {
        return (
          <Redirect
            to={{
              pathname: `/login`,
              search: `?next=${this.props.history.location.pathname}`,
              state: { next: this.props.history.location.pathname },
              from: this.props.match.path,
            }}
          />
        );
      }

      return <ComposedComponent {...this.props} />;
    }
  }

  Authentication.propTypes = {
    isLoggedIn: PropTypes.bool,
    history: PropTypes.object,
    match: PropTypes.object,
  };

  function mapStateToProps(state) {
    return { isLoggedIn: state.auth.get("isLoggedIn") };
  }

  return connect(mapStateToProps)(Authentication);
};
