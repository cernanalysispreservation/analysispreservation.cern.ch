import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Box from "grommet/components/Box";
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
        mine: {
          list: this.props.results.user_workflows.data,
          more: this.props.results.user_workflows.more
        }
      }
    };
  };

  render() {
    let lists = this._getList();
    return (
      <Box colorIndex="light-2" flex full>
        {this.props.loading ? (
          <Box flex align="center" justify="center">
            <Spinning size="large" />
          </Box>
        ) : (
          <Box colorIndex="light-2" flex align="center">
            <Box
              direction="row"
              wrap
              align="center"
              pad={{
                between: "large",
                horizontal: "large"
              }}
            >
              <DashboardMeter
                total={this.props.results.user_count}
                drafts={this.props.results.user_drafts_count}
                published={this.props.results.user_published_count}
              />
              <DashboardList
                listType="draft"
                list={lists["drafts"]}
                header="drafts"
                ListItem={DashboardListItem}
                emptyMessage="Draft analyses that your collaborators have given you read/write access to."
              />
              <DashboardQuickSearch />
              <DashboardList
                listType="published"
                list={lists["published"]}
                header="published in collaboration"
                ListItem={DashboardListItem}
                emptyMessage="All analyses published on CAP by members of your collaboration."
              />
              <DashboardList
                listType="workflows"
                list={lists["workflows"]}
                header="workflows"
                ListItem={DashboardWorkflowListItem}
                emptyMessage="Recent workflows attached to your content"
              />
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
  loading: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    loading: state.dashboard.get("loading"),
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
