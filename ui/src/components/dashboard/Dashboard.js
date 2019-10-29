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
    console.log("dashdashdash", this.props.results);
    return (
      <Box full={true} colorIndex="light-2">
        <Header
          size="small"
          colorIndex="neutral-1-a"
          pad="none"
          wrap={true}
          justify="center"
        />
        {!this.props.permissions && (
          <Notification
            message="Your account has no permissions for the platform."
            status="warning"
          />
        )}
        {this.props.results ? (
          <Box direction="row" wrap>
            <Box
              pad="large"
              size={{ width: { min: "xlarge" } }}
              flex={false}
              basis="1/2"
            >
              <DashboardList
                listType="published"
                items={this.props.results.published_by_collab.data}
                header="published in collaboration"
                urlDetailed="/published"
                urlMore={this.props.results.published_by_collab.more}
                emptyMessage="All analyses published on CAP by members of your collaboration."
              />
            </Box>
            <Box
              pad="large"
              size={{ width: { min: "xlarge" } }}
              flex={false}
              basis="1/2"
            >
              <DashboardList
                listType="draft"
                items={this.props.results.shared_with_user.data}
                header="shared with you"
                urlDetailed="/drafts"
                urlMore={this.props.results.shared_with_user.more}
                emptyMessage="Draft analyses that your collaborators have given you read/write access to."
              />
            </Box>
            <Box
              pad="large"
              size={{ width: { min: "xlarge" } }}
              flex={false}
              basis="1/2"
            >
              <DashboardList
                listType="published"
                items={this.props.results.published_by_collab.data}
                header="latest from your group"
                urlDetailed="/published"
                urlMore={this.props.results.published_by_collab.more}
                emptyMessage="All analyses published on CAP by members of your working group."
              />
            </Box>
            <Box
              pad="large"
              size={{ width: { min: "xlarge" } }}
              flex={false}
              basis="1/2"
            >
              <DashboardList
                listType="drafts"
                items={this.props.results.user_drafts.data}
                header="your drafts"
                urlDetailed="/drafts"
                urlMore={this.props.results.user_drafts.more}
                emptyMessage="Your draft analyses. By default, only you can access them, but it is possible to give read/write access to other collaborators."
              />
            </Box>
            <Box pad="medium" flex={false} basis="1/2">
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
            <Box
              pad="large"
              size={{ width: { min: "xlarge" } }}
              flex={false}
              basis="1/2"
            >
              <DashboardList
                listType="published"
                items={this.props.results.user_published.data}
                header="published by you"
                urlDetailed="/published"
                urlMore={this.props.results.user_published.more}
                emptyMessage="Your published analyses. Once published on CAP, all members of your collaboration will have read access."
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
