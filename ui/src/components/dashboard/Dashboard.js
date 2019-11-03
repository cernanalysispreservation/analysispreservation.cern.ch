import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AnnotatedMeter from "grommet-addons/components/AnnotatedMeter";

import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Notification from "grommet/components/Notification";

import { withRouter } from "react-router-dom";
import { fetchDashboard } from "../../actions/dashboard";

import DashboardList from "./DashboardList";
class Dashboard extends React.Component {
  componentDidMount() {
    this.props.fetchDashboard();
  }

  render() {
    return (
      <Box full={true} colorIndex="light-2">
        {!this.props.permissions && (
          <Notification
            message="Your account has no permissions for the platform."
            status="warning"
          />
        )}
        {this.props.results ? (
        <Box>
          <Box direction="row" wrap>
            <Box pad="medium" size={{ width: { min: "medium" } }} flex>
              <DashboardList
                  datasets={{
                      all: this.props.results.published,
                      mine: this.props.results.user_published,
                  }}
                header="recently published"
                urlDetailed="/published"
                emptyMessage="All analyses published on CAP by members of your collaboration."
              />
            </Box>
            <Box pad="medium" size={{ width: { min: "medium" } }} flex>
              <DashboardList
                datasets={{
                    all: this.props.results.drafts,
                    mine: this.props.results.user_drafts,
                }}
                header="drafts"
                urlDetailed="/drafts"
                emptyMessage="Draft analyses that you have read/write access to."
              />
            </Box>
          </Box>
           <Box direction="row" wrap>
            <Box pad="small" flex align="center">
              <AnnotatedMeter
                legend={true}
                type="circle"
                defaultMessage="Your"
                max={this.props.results.user_count}
                series={[
                  {
                    label: "Your Drafts",
                    value: this.props.results.user_drafts_count,
                    colorIndex: "graph-1"
                  },
                  {
                    label: "Published",
                    value: this.props.results.user_published_count,
                    colorIndex: "graph-2"
                  }
                ]}
              />
            </Box>
          </Box>
      </Box>
 
        ) : null}
      </Box>
    );
  }
}

Dashboard.propTypes = {
  fetchDashboard: PropTypes.func,
  currentUser: PropTypes.object,
  results: PropTypes.object,
  history: PropTypes.object,
  permissions: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    permissions: state.auth.getIn(["currentUser", "permissions"]),
    results: state.dashboard.getIn(["results"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchDashboard: () => dispatch(fetchDashboard())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));
