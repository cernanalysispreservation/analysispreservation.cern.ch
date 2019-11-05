import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Notification from "grommet/components/Notification";
import Spinning from "grommet/components/icons/Spinning";

import { withRouter } from "react-router-dom";
import { fetchDashboard } from "../../actions/dashboard";

import DashboardList from "./DashboardList";
import DashboardListItem from "./DashboardListItem";
import DashboardWorkflowListItem from "./DashboardWorkflowListItem";
import DashboardMeter from "./components/DashboardMeter";
import DashboardQuickSearch from "./DashboardQuickSearch";

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.fetchDashboard();
  }

  _getList = () => {
    return {
      drafts: {
        all: {
          list: this.props.results.drafts.data,
          more: this.props.results.drafts.more
        },
        mine: {
          list: this.props.results.user_drafts.data,
          more: this.props.results.user_drafts.more
        }
      },
      published: {
        all: {
          list: this.props.results.published.data,
          more: this.props.results.published.more
        },
        mine: {
          list: this.props.results.user_published.data,
          more: this.props.results.user_published.more
        }
      },
      workflows: {
        all: {
          list: this.props.results.user_workflows.data,
          more: this.props.results.user_workflows.more
        }
      }
    };
  };

  render() {
    let lists = this._getList();
    return (
      <Box full={true} colorIndex="light-2" pad={{horizontal: "small"}}>
        {!this.props.permissions && (
          <Notification
            message="Your account has no permissions to access the platform resources."
            status="warning"
          />
        )}
        {this.props.loading ? (
          <Box flex align="center" justify="center">
            <Spinning size="large" />
          </Box>
        ) : (
          <Box>
            <Box direction="row" wrap align="center">
              <Box pad="medium" size={{ width: { min: "medium" } }} flex={true}>
                <DashboardList
                  listType="draft"
                  list={lists["drafts"]}
                  header="drafts"
                  ListItem={DashboardListItem}
                  emptyMessage="Draft analyses that your collaborators have given you read/write access to."
                />
              </Box>
              <Box pad="small" size={{ width: "small" }}>
                <DashboardQuickSearch />
              </Box>
              <DashboardMeter
                total={this.props.results.user_count}
                drafts={this.props.results.user_drafts_count}
                published={this.props.results.user_published_count}
              />

            </Box>

            <Box direction="row" wrap align="center" justify="between">
              <Box pad="medium" size={{ width: { min: "medium" } }} flex={true}>
                <DashboardList
                  listType="published"
                  list={lists["published"]}
                  header="published in collaboration"
                  ListItem={DashboardListItem}
                  emptyMessage="All analyses published on CAP by members of your collaboration."
                />
              </Box>
              <Box pad="medium" size={{ width: { max: "xlarge" } }} flex={true}>
                <DashboardList
                  listType="workflows"
                  list={lists["workflows"]}
                  header="workflows"
                  ListItem={DashboardWorkflowListItem}
                  emptyMessage="Recent workflows attached to your content"
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    );
  }
}

Dashboard.propTypes = {
  fetchDashboard: PropTypes.func,
  currentUser: PropTypes.object,
  results: PropTypes.object,
  history: PropTypes.object,
  permissions: PropTypes.bool,
  loading: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    loading: state.dashboard.get("loading"),
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
