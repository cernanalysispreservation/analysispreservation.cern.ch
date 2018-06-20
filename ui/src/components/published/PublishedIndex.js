import _ from 'lodash';
import PropTypes from 'prop-types';

import React from 'react';

import {connect} from 'react-redux';

import Box from 'grommet/components/Box';

import PublishedItem from '../published/PublishedItem';
import RerunPublished from '../published/RerunPublished';
import RerunStatus from '../published/RerunStatus';
import {Switch, Route} from 'react-router-dom';
import {withRouter} from 'react-router';

class DraftsIndex extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box flex={true}>
        <Switch>
          <Route exact path={`/published/:id`} component={PublishedItem}  />
          <Route path={`/published/:id/rerun`} component={RerunPublished} />
          <Route path={`/published/:id/status/:workflow_id`} component={RerunStatus} />
        </Switch>
      </Box>
    );
  }
}

DraftsIndex.propTypes = {
  startDeposit: PropTypes.func
};

function mapStateToProps(state) {
  return {
    groups: state.auth.getIn(['currentUser', 'depositGroups'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftsIndex));
