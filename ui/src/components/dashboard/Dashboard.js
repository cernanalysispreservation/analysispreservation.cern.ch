import React from "react";
import PropTypes from "prop-types";
import Distribution from "grommet/components/Distribution";
import { connect } from "react-redux";
import AnnotatedMeter from "grommet-addons/components/AnnotatedMeter";
import MoreIcon from "grommet/components/icons/base/More";

import {
  Box,
  Section,
  Heading,
  Header,
  Tiles,
  Tile,
  List,
  ListItem,
  Anchor,
  Value
} from "grommet";

import { withRouter } from "react-router-dom";
import { fetchDashboard } from "../../actions/dashboard";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";

function DashboardList(props) {
  return (
    <Box>
      <Heading tag="h5" uppercase={true} align="center" justify="center">
        {props.header}
      </Heading>
      <List>
        {props.items.length > 0 ? (
          props.items.map(item => {
            let metadata = item.metadata;
            let id = item.id;

            return (
              <ListItem justify="center">
                <Anchor
                  path={`${props.url}/${id}`}
                  style={{ "text-decoration": "none", color: "black" }}
                >
                  {metadata.general_title || id}
                </Anchor>
              </ListItem>
            );
          })
        ) : (
          <ListPlaceholder unfilteredTotal={0} emptyMessage="No analysis." />
        )}
      </List>
      {props.items.length > 0 ? (
        <Box align="center">
          <Anchor
            path="/search"
            style={{ "text-decoration": "none", color: "black" }}
          >
            <MoreIcon />
          </Anchor>
        </Box>
      ) : null}
    </Box>
  );
}

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.fetchDashboard();
  }

  render() {
    return (
      <Box full={true} colorIndex="light-2">
        <Header
          size="small"
          colorIndex="neutral-1-a"
          pad="none"
          wrap={true}
          justify="center"
        />
        <Tiles full={true}>
          <Tile pad="large" basis="1/3">
            <DashboardList
              items={this.props.results.published_by_collab}
              header="published in collaboration"
              url="/published"
            />
          </Tile>
          <Tile pad="large" basis="1/3">
            <DashboardList
              items={this.props.results.shared_with_user}
              header="shared with you"
              url="/drafts"
            />
          </Tile>
          <Tile pad="large" basis="1/3">
            <DashboardList
              items={this.props.results.published_by_collab}
              header="latest from your group"
              url="/published"
            />
          </Tile>
          <Tile pad="large" basis="1/3">
            <DashboardList
              items={this.props.results.user_drafts}
              header="your drafts"
              url="/drafts"
            />
          </Tile>
          <Tile pad="medium" basis="1/3">
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
          </Tile>
          <Tile pad="large" basis="1/3">
            <DashboardList
              items={this.props.results.user_published}
              header="published by you"
              url="/published"
            />
          </Tile>
        </Tiles>
      </Box>
    );
  }
}

Dashboard.propTypes = {
  fetchDashboard: PropTypes.func,
  currentUser: PropTypes.object,
  results: PropTypes.object,
  history: PropTypes.object
};

function mapStateToProps(state) {
  return {
    currentUser: state.auth.getIn(["currentUser"]),
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
