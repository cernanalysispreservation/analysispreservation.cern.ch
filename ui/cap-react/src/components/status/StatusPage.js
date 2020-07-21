import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Header from "../partials/Header";
import DropDown from "../DropDown/DropDown";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Paragraph from "grommet/components/Paragraph";
import Spinning from "grommet/components/icons/Spinning";

import { fetchServicesStatus } from "../../actions/status";
import _groupBy from "lodash/groupBy";
import Footer from "../footer/Footer";

import DocumentTitle from "../partials/Title";

class StatusPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grouped: {},
      keys: []
    };
  }

  componentDidMount() {
    // fetch services before load
    this.props.fetchStatus();
  }

  render() {
    return [
      <DocumentTitle key="header" title="Status">
        <Header />
      </DocumentTitle>,
      <Box key="body" flex={true}>
        <Box align="center">
          <Box align="center" size="large">
            <Heading margin="large" tag="h2">
              Status page
            </Heading>
            <Paragraph>
              In this page you can monitor the status of all services.
            </Paragraph>
            {this.props.error ? (
              <Paragraph>
                The service is currently unavailable. Please try again later...
              </Paragraph>
            ) : Object.keys(this.props.services).length <= 1 ? (
              <Spinning />
            ) : (
              <React.Fragment>
                {Object.keys(this.props.services).map((item, index) => (
                  <DropDown
                    key={index}
                    title={item === undefined ? "Others" : item}
                    items={this.props.services[item]}
                  />
                ))}
              </React.Fragment>
            )}
          </Box>
        </Box>
      </Box>,
      <Footer key="footer" />
    ];
  }
}

function mapStateToProps(state) {
  return {
    services: _groupBy(state.status.get("services"), "category"),
    error: state.status.get("error")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchStatus: () => dispatch(fetchServicesStatus())
  };
}

StatusPage.propTypes = {
  error: PropTypes.bool,
  services: PropTypes.object,
  fetchStatus: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusPage);
