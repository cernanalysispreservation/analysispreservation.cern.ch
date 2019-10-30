import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AnnotatedMeter from "grommet-addons/components/AnnotatedMeter";

import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Tiles from "grommet/components/Tiles";
import Tile from "grommet/components/Tile";
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
        {/* <Header
          size="small"
          colorIndex="neutral-1-a"
          pad="none"
          wrap={true}
          justify="center"
        /> */}
        {!this.props.permissions && (
          <Notification
            message="Your account has no permissions for the platform."
            status="warning"
          />
        )}
        {this.props.results ? (
          <Box direction="row" wrap>
            <Box pad="medium" size={{ width: { min: "medium" } }} flex={true}>
              <DashboardList
                listType="published"
                collab_items={this.props.results.published_by_collab.data}
                collab_items_title="collaboration"
                mine={this.props.results.user_published.data}
                header="published in collaboration"
                urlDetailed="/published"
                urlMore={this.props.results.published_by_collab.more}
                emptyMessage="All analyses published on CAP by members of your collaboration."
              />
            </Box>
            <Box pad="small" flex={false} align="center">
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
            <Box pad="medium" size={{ width: { min: "medium" } }} flex={true}>
              <DashboardList
                listType="draft"
                collab_items={this.props.results.shared_with_user.data}
                collab_items_title="shared"
                show_all
                mine={this.props.results.user_drafts.data}
                header="drafts"
                urlDetailed="/drafts"
                urlMore={this.props.results.shared_with_user.more}
                emptyMessage="Draft analyses that your collaborators have given you read/write access to."
              />
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
