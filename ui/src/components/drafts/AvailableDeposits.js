import React from "react";

import { connect } from "react-redux";

import PropTypes from "prop-types";

import { Box, Heading, Tiles, Tile, Paragraph } from "grommet";

import { withRouter } from "react-router-dom";

const CustomTile = withRouter(
  ({ history, props = props, group = group, name = name }) => (
    <Tile
      key={group}
      size="small"
      pad="medium"
      colorIndex="light-2"
      onClick={() => history.push(`/drafts/create/${group}`)}
    >
      <Paragraph align="center">
        <strong>{name}</strong>
      </Paragraph>
    </Tile>
  )
);

class AvailableDeposits extends React.Component {
  render() {
    return (
      <Box flex={true} justify="center">
        <Heading align="center" tag="h3">
          Which analysis you would like to preserve
        </Heading>
        <Tiles flush={false} fill={false} size="large" justify="center">
          {this.props.groups ? (
            this.props.groups.map(group => (
              <CustomTile
                key={group}
                props={this.props}
                group={group.get("deposit_group")}
                name={group.get("name")}
              />
            ))
          ) : (
            <Box> No available schemas.</Box>
          )}
        </Tiles>
      </Box>
    );
  }
}

AvailableDeposits.propTypes = {
  groups: PropTypes.object
};

function mapStateToProps(state) {
  return {
    groups: state.auth.getIn(["currentUser", "depositGroups"])
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AvailableDeposits);
