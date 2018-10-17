import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  Box,
  Section,
  Heading,
  Header,
  Tiles,
  Label,
  Tile,
  Value
} from "grommet";

import { withRouter } from "react-router-dom";
import { fetchSearch, fetchMine } from "../../actions/search";
import SearchResults from "../search/SearchResults";
import AddIcon from "grommet/components/icons/base/Add";
import Home from "grommet/components/icons/base/Home";
import SearchIcon from "grommet/components/icons/base/Search";

const CustomTile = withRouter(
  ({ history, props = props, group = group, name = name, count = count }) => (
    <Tile key={group} colorIndex="light-2">
      <Box size="medium" direction="column" wrap={true} flex={true}>
        <Header size="small">
          <Box
            alignSelf="start"
            colorIndex="grey-2"
            flex={true}
            direction="row"
            pad="small"
            justify="between"
            align="center"
          >
            <Label margin="none">{name}</Label>
            <Box
              justify="center"
              align="center"
              onClick={() =>
                history.push(`/drafts/create/${group.get("deposit_group")}`)
              }
            >
              <AddIcon />
            </Box>
          </Box>
        </Header>
        <Box
          flex={true}
          direction="row"
          justify="between"
          align="center"
          pad="medium"
        >
          <Value
            label="Drafts"
            value={count}
            onClick={() =>
              history.push(
                `/search?status=draft&type=${group.get("deposit_group")}-v0.0.1`
              )
            }
          />
          <Value
            label="Published"
            value={count}
            onClick={() =>
              history.push(
                `/search?status=published&type=${group.get(
                  "deposit_group"
                )}-v0.0.1`
              )
            }
          />
          <Value
            label="Yours"
            value={count}
            onClick={() =>
              history.push(`/search?type=${group.get("deposit_group")}-v0.0.1`)
            }
          />
        </Box>
      </Box>
    </Tile>
  )
);

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.fetchSearch();
    this.props.fetchMine(this.props.currentUser.get("token"));
  }

  getFacetTypes() {
    let _types = {};
    this.props.results.getIn(["aggregations", "facet_type", "buckets"])
      ? this.props.results
          .getIn(["aggregations", "facet_type", "buckets"])
          .map(item => {
            _types[item.get("key")] = item.get("doc_count");
          })
      : null;

    return _types;
  }

  getDraftCount(type, version = "v0.0.1") {
    const _type = `${type}-${version}`;
    const facets = this.getFacetTypes();
    return facets[_type] || 0;
  }

  render() {
    return (
      <Box flex={true} direction="row">
        <Box flex={false} colorIndex="brand" pad="small">
          <Box pad={{ vertical: "small" }}>
            <Home size="medium" />
          </Box>
          <Box
            pad={{ vertical: "small" }}
            onClick={() => this.props.history.push(`/search`)}
          >
            <SearchIcon size="medium" />
          </Box>
          <Box
            pad={{ vertical: "small" }}
            onClick={() => this.props.history.push(`/drafts/create`)}
          >
            <AddIcon size="medium" />
          </Box>
        </Box>
        <Box flex={true}>
          <Box flex={false}>
            <Section>
              <Box margin={{ top: "medium", horizontal: "medium" }}>
                <Heading align="start" tag="h3">
                  Overview
                </Heading>
              </Box>
              <Tiles flush={false} fill={false} size="large">
                {this.props.currentUser &&
                this.props.currentUser.get("depositGroups") &&
                this.props.currentUser.get("depositGroups").map ? (
                  this.props.currentUser
                    .get("depositGroups")
                    .map(group => (
                      <CustomTile
                        key={group}
                        props={this.props}
                        count={this.getDraftCount(group.get("deposit_group"))}
                        group={group}
                        name={group.get("name")}
                      />
                    ))
                ) : (
                  <Box> No available schemas.</Box>
                )}
              </Tiles>
            </Section>
            <Section>
              <Box margin={{ top: "medium", horizontal: "medium" }}>
                <Heading align="start" tag="h3">
                  My Drafts
                </Heading>
              </Box>
              <Box
                pad="medium"
                colorIndex="light-2"
                size={{ height: "medium" }}
              >
                {this.props.mine.getIn(["hits", "hits"]) ? (
                  <SearchResults
                    size="small"
                    results={
                      this.props.mine.getIn(["hits", "hits"]).toJS() || {}
                    }
                  />
                ) : null}
              </Box>
            </Section>
          </Box>
        </Box>
      </Box>
    );
  }
}

Dashboard.propTypes = {
  fetchSearch: PropTypes.func,
  fetchMine: PropTypes.func,
  currentUser: PropTypes.object,
  results: PropTypes.object,
  mine: PropTypes.object,
  history: PropTypes.object
};

function mapStateToProps(state) {
  return {
    currentUser: state.auth.getIn(["currentUser"]),
    selectedAggs: state.search.getIn(["selectedAggs"]),
    results: state.search.getIn(["results"]),
    mine: state.search.getIn(["mine"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSearch: () => dispatch(fetchSearch()),
    fetchMine: id => dispatch(fetchMine(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));
