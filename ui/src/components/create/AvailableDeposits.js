import _ from 'lodash';
import React from 'react';

import {connect} from 'react-redux';

import {Box, Heading, Tiles, Tile, Paragraph} from 'grommet';

import _isEqual from 'lodash/isEqual';

import {selectSchema} from '../../actions/drafts';
import {withRouter} from 'react-router-dom';

const CustomTile = withRouter(({ history, props=props, group=group, name=name}) => (
      <Tile key={group}
            size="small"
            pad="small"
            colorIndex="light-2"
            onClick={() => (
              history.push(`/drafts/create/${group}`)
              )}>
        <Paragraph align="center">{name}</Paragraph>
      </Tile>
    ))

export class AvailableDeposits extends React.Component {

  render() {
    return (
      <Box flex={true} justify="center">
        <Heading align="center" tag="h6">Choose a schema to start</Heading>
        <Tiles flush={false} fill={false} size="large" justify="center">
          {
            this.props.groups ?
            this.props.groups.map(group => (
              <CustomTile key={group} props={this.props} group={group.get("deposit_group")} name={group.get("name")}/>
            )) :
            <Box> No available schemas.</Box>
          }
        </Tiles>
      </Box>
    );
  }
}

AvailableDeposits.propTypes = {};

function mapStateToProps(state) {
  return {
    groups: state.auth.getIn(['currentUser', 'depositGroups'])
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AvailableDeposits);
