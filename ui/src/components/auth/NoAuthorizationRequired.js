import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export default function (ComposedComponent) {
  class NotAuthentication extends Component {
    componentWillMount() {
      if (this.props.isLoggedIn) {
        this.props.history.push('/');
      }
    }

    componentWillUpdate(nextProps) {
      if (nextProps.isLoggedIn) {
        this.props.history.push('/');
      }
    }

    shouldComponentUpdate(nextProps) {
      if (this.props.isLoggedIn === nextProps.isLoggedIn)
        return false;
    }

    PropTypes = {
      router: PropTypes.object,
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }


  NotAuthentication.propTypes = {
    isLoggedIn: PropTypes.bool,
    history: PropTypes.object
  };

  function mapStateToProps(state) {
    return { isLoggedIn: state.auth.get('isLoggedIn') };
  }

  return connect(mapStateToProps)(NotAuthentication);
}